//@flow
import React, { Component } from 'react';
import matchMedia from 'matchmediaquery'

export default function makeResponsive(component: Component, mediaTypes, fallbackMediaType: string) {
    return new ResponsiveComponentManager(mediaTypes, component, fallbackMediaType);
}

export class Responsive extends Component {

    componentWillMount() {
        this._responsiveComponentManager = makeResponsive(this, this.props.mediaTypes, this.props.fallbackMediaType);
    }

    componentWillUnmount() {
        this._responsiveComponentManager.dispose();
    }

    render() {
        let responsiveChildren = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, { mediaType: this.state.mediaType });
        });

        return <div>{responsiveChildren}</div>;
    }
}

// If nothing is supplied we use the Bootstrap 4 defaults
const defaultMediaTypes = {
    xs: '(max-width: 576px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)',
};

class ResponsiveComponentManager {
    _mediaMatcherTypes = [];

    constructor(mediaTypes, component: Component, fallbackMediaType: string) {
        debugger;
        if (!mediaTypes) {
            mediaTypes = defaultMediaTypes;
        }

        let currentlyMatchingMediaType = null;

        for (var mediaType in mediaTypes) {
            if (mediaTypes.hasOwnProperty(mediaType)) {
                let query = mediaTypes[mediaType];

                let mediaMatcherType = new MediaMatcher(mediaType, query, component);
                this._mediaMatcherTypes.push(mediaMatcherType);

                if (mediaMatcherType.isMatching()) {
                    currentlyMatchingMediaType = mediaMatcherType.mediaType;
                    console.log("Currently matching " + currentlyMatchingMediaType);
                }
            }
        }

        currentlyMatchingMediaType = currentlyMatchingMediaType || fallbackMediaType;

        component.setState({ ...component.state, mediaType: currentlyMatchingMediaType });
    }

    dispose() {
        this._mediaMatcherTypes.forEach(mmt => mmt.dispose());
    }
}

class MediaMatcher {

    mediaType: string;
    query: string;

    _matchMedia;
    _matchEventListener;
    _component;

    constructor(mediaType: string, query: string, component: Component) {
        this.mediaType = mediaType;
        this.query = query;
        this._matchMedia = matchMedia(query);

        this._matchEventListener = this.onMatch.bind(this);
        this._matchMedia.addListener(this._matchEventListener);

        this._component = component;
    }

    tryMatching() {
        if (this.isMatching()) {
            this.onMatch();
        }
    }

    isMatching(): boolean {
        return this._matchMedia.matches;
    }

    // Cleanup
    dispose() {
        console.log("Cleaning up inner");
        this._matchMedia.removeListener(this._matchEventListener);
    }

    onMatch(e) {
        if (e.matches) {
            console.log("Got a match of type: " + this.mediaType);
            this._component.setState({ ...this._component.state, mediaType: this.mediaType });
        }
    }
}


// @media (min-width: 576px) {
//   .container {
//     padding-right: 15px;
//     padding-left: 15px;
//   }
// }

// @media (min-width: 768px) {
//   .container {
//     padding-right: 15px;
//     padding-left: 15px;
//   }
// }

// @media (min-width: 992px) {
//   .container {
//     padding-right: 15px;
//     padding-left: 15px;
//   }
// }

// @media (min-width: 1200px) {
//   .container {
//     padding-right: 15px;
//     padding-left: 15px;
//   }
// }

// @media (min-width: 576px) {
//   .container {
//     width: 540px;
//     max-width: 100%;
//   }
// }

// @media (min-width: 768px) {
//   .container {
//     width: 720px;
//     max-width: 100%;
//   }
// }

// @media (min-width: 992px) {
//   .container {
//     width: 960px;
//     max-width: 100%;
//   }
// }

// @media (min-width: 1200px) {
//   .container {
//     width: 1140px;
//     max-width: 100%;
//   }
// }