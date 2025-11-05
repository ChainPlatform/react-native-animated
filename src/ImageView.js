import { Component } from 'react';
import { Animated, View, Platform, Easing } from 'react-native';
import { SvgUri } from 'react-native-svg';

/**
 * ImageView
 *
 * Props:
 * - imageType: "link" | "local"
 * - source: string | require()
 * - resizeMode: string
 * - style: object
 * - onImageLoaded: (bool) => void
 * - placeholderType: "solid" | "shimmer" (default: "shimmer")
 * - placeholderColor: string (default: "#e0e0e0")
 * - transitionDuration: number (default: 300)
 * - shimmerAngle: number (default: 15)
 * - shimmerWidth: number (default: 20)
 * - shimmerSpeed: number (default: 1300)
 * - shimmerIntensity: number (default: 0.55)
 */
export default class ImageView extends Component {
    constructor(props) {
        super(props);
        this.imageAnimated = new Animated.Value(0);
        this.placeholderAnimated = new Animated.Value(0);
        this.fadeOutPlaceholder = new Animated.Value(1);
        this.state = { loaded: false, error: false };
        this.placeholderLoop = null;
    }

    get useDriver() {
        return Platform.OS !== 'web';
    }

    componentDidMount() {
        if (this.props.placeholderType === 'shimmer') {
            this.startPlaceholderAnimation();
        }
    }

    componentWillUnmount() {
        if (this.placeholderLoop) this.placeholderLoop.stop();
    }

    startPlaceholderAnimation() {
        const shimmerSpeed = this.props.shimmerSpeed || 1300;
        this.placeholderLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(this.placeholderAnimated, {
                    toValue: 1,
                    duration: shimmerSpeed,
                    easing: Easing.linear,
                    useNativeDriver: this.useDriver,
                }),
                Animated.timing(this.placeholderAnimated, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: this.useDriver,
                }),
            ])
        );
        this.placeholderLoop.start();
    }

    onImageLoad = () => {
        const duration = this.props.transitionDuration || 300;
        Animated.timing(this.imageAnimated, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: this.useDriver,
        }).start(() => {
            this.setState({ loaded: true });
            if (typeof this.props.onImageLoaded === 'function') {
                this.props.onImageLoaded(true);
            }
        });
    };

    onError = (e) => {
        console.warn('Image load failed:', e?.nativeEvent?.error || e);
        this.setState({ error: true });
    };

    isSVG(link, imageType) {
        if (imageType !== 'link' || typeof link !== 'string' || Platform.OS === 'web') return false;
        try {
            return new URL(link).pathname.toLowerCase().endsWith('.svg');
        } catch {
            return false;
        }
    }

    renderPlaceholder() {
        const {
            style,
            placeholderType,
            placeholderColor,
            shimmerAngle = 15,
            shimmerWidth = 20,
            shimmerIntensity = 0.55
        } = this.props;

        const baseColor = placeholderColor || '#e0e0e0';
        const highlightColor = `rgba(255,255,255,${shimmerIntensity})`;
        const height = style?.height || 64;
        const width = typeof style?.width === 'number' ? style.width : 200;

        if (placeholderType === 'solid') {
            return (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: baseColor,
                            borderRadius: style?.borderRadius || 0,
                            opacity: this.fadeOutPlaceholder,
                        },
                        style,
                    ]}
                />
            );
        }

        // Animation chỉ trong phạm vi width ảnh
        const translateX = this.placeholderAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [-shimmerWidth, width + shimmerWidth],
        });

        return (
            <Animated.View
                pointerEvents="none"
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: baseColor,
                        overflow: 'hidden',
                        borderRadius: style?.borderRadius || 0,
                        opacity: this.fadeOutPlaceholder,
                    },
                    style,
                ]}
            >
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: -shimmerWidth / 2,
                        height: height + shimmerWidth,
                        width: shimmerWidth,
                        transform: [
                            { translateX },
                            { rotate: `${shimmerAngle}deg` },
                        ],
                        backgroundColor: highlightColor,
                        shadowColor: highlightColor,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        shadowRadius: style?.borderRadius || 0,
                        opacity: 0.8,
                    }}
                />
            </Animated.View>
        );
    }

    renderSVG(link) {
        const { style } = this.props;
        return (
            <SvgUri
                width={style?.width || 64}
                height={style?.height || 64}
                uri={link}
                onLoad={this.onImageLoad}
                onError={this.onError}
            />
        );
    }

    renderIMG(source) {
        const { resizeMode, style } = this.props;
        return (
            <Animated.Image
                source={source}
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        opacity: this.imageAnimated,
                    },
                    style,
                ]}
                resizeMode={resizeMode || 'cover'}
                onLoad={this.onImageLoad}
                onError={this.onError}
                blurRadius={this.state.loaded ? 0 : 3}
            />
        );
    }

    render() {
        const { imageType, source, style } = this.props;
        const { loaded, error } = this.state;

        if (!imageType || !source || error) {
            return <View style={[style, { backgroundColor: this.props.placeholderColor || '#e0e0e0' }]} />;
        }

        const isSvg = this.isSVG(source, imageType);
        const imageSource = imageType === 'link' ? { uri: source } : source;

        return (
            <View style={style}>
                {!loaded && this.renderPlaceholder()}
                {isSvg ? this.renderSVG(source) : this.renderIMG(imageSource)}
            </View>
        );
    }
}
