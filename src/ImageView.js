import { Component } from 'react';
import { Animated, View, Platform, Easing, ActivityIndicator } from 'react-native';
import { SvgUri } from 'react-native-svg';

export default class ImageView extends Component {
    static cache = new Set();

    constructor(props) {
        super(props);
        this.imageAnimated = new Animated.Value(0);
        this.placeholderAnimated = new Animated.Value(0);
        this.fadeOutPlaceholder = new Animated.Value(1);
        this.state = {
            loaded: false,
            error: false,
            measuredWidth: 0,
            measuredHeight: 0,
            isCached: false,
        };
    }

    get useDriver() {
        return Platform.OS !== 'web';
    }

    componentDidMount() {
        const { imageType, source, placeholderMode = 'shimmer' } = this.props;
        const cacheKey = imageType === 'link' ? source : JSON.stringify(source);

        if (ImageView.cache.has(cacheKey)) {
            this.setState({ loaded: true, isCached: true });
        } else if (placeholderMode === 'shimmer') {
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
        const cacheKey = this.props.imageType === 'link' ? this.props.source : JSON.stringify(this.props.source);
        ImageView.cache.add(cacheKey);

        Animated.timing(this.imageAnimated, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: this.useDriver,
        }).start(() => {
            this.setState({ loaded: true });
            this.props.onImageLoaded?.(true);
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

    handleLayout = (e) => {
        const { width, height } = e.nativeEvent.layout;
        this.setState({ measuredWidth: width, measuredHeight: height });
    };

    renderPlaceholder() {
        const {
            style,
            placeholderMode = 'shimmer',
            placeholderColor,
            shimmerAngle = 15,
            shimmerWidth = 20,
            shimmerIntensity = 0.55,
            loadingIcon,
        } = this.props;

        const { measuredWidth, measuredHeight } = this.state;
        const width = typeof style?.width === 'number' ? style.width : measuredWidth;
        const height = typeof style?.height === 'number' ? style.height : measuredHeight || 64;
        if (!width) return null;

        const baseColor = placeholderColor || '#e0e0e0';
        const highlightColor = `rgba(255,255,255,${shimmerIntensity})`;

        const translateX = this.placeholderAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [-shimmerWidth, width + shimmerWidth],
        });

        if (placeholderMode === 'icon') {
            return (
                <View
                    style={[
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: baseColor,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: style?.borderRadius || 0,
                        },
                        style,
                    ]}
                >
                    {loadingIcon || (
                        <ActivityIndicator
                            size={Platform.OS == 'web' ? "large" : "small"}
                            color={this.props.spinnerColor || '#999'}
                        />
                    )}
                </View>
            );
        }

        if (placeholderMode === 'solid') {
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
                        opacity: 0.8,
                    }}
                />
            </Animated.View>
        );
    }

    render() {
        const { imageType, source, style } = this.props;
        const { loaded, error, isCached } = this.state;

        if (!imageType || !source || error) {
            return (
                <View
                    style={[
                        style,
                        { backgroundColor: this.props.placeholderColor || '#e0e0e0' },
                    ]}
                />
            );
        }

        const isSvg = this.isSVG(source, imageType);
        const imageSource = imageType === 'link' ? { uri: source } : source;

        return (
            <View style={style} onLayout={this.handleLayout}>
                {!loaded && !isCached && this.renderPlaceholder()}

                {isSvg ? (
                    <Animated.View style={{ opacity: this.imageAnimated }}>
                        <SvgUri
                            width={style?.width || this.state.measuredWidth || 64}
                            height={style?.height || this.state.measuredHeight || 64}
                            uri={source}
                            onLoad={this.onImageLoad}
                            onError={this.onError}
                        />
                    </Animated.View>
                ) : (
                    <Animated.Image
                        source={imageSource}
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
                        resizeMode={this.props.resizeMode || 'cover'}
                        onLoad={this.onImageLoad}
                        onError={this.onError}
                        blurRadius={loaded ? 0 : 5}
                    />
                )}
            </View>
        );
    }
}
