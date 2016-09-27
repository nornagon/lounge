import React from "react";
import elementResizeDetectorMaker from "element-resize-detector";

const SCROLL_BOTTOM = 1000000;

export default class StickyScroll extends React.Component {
	componentDidMount() {
		this.resizeListener = () => this.onResize();

		this.erd = elementResizeDetectorMaker({strategy: "scroll"});
		this.erd.listenTo(this.refs.root, resizeListener);
		window.addEventListener("resize", resizeListener);

		this.refs.root.scrollTop = SCROLL_BOTTOM;
		this.wasScrolledToBottom = true;
	}

	componentWillUnmount() {
		this.erd.uninstall(this.refs.root)
		window.removeEventListener("resize", resizeListener);
	}

	componentWillUpdate(nextProps) {
		if (this.props.isActive && nextProps.isActive) {
			let {scrollTop, scrollHeight, offsetHeight} = this.refs.root;
			this.prevScrollFromBottom = scrollHeight - scrollTop;
			this.prevScrollHeight = scrollHeight;
			this.wasScrolledToBottom = scrollTop + offsetHeight >= scrollHeight;
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.isActive) {
			let node = this.refs.root;
			if (this.wasScrolledToBottom) {
				node.scrollTop = SCROLL_BOTTOM;
			} else {
				let isFetchMore = this.props.firstId < prevProps.firstId;
				if (isFetchMore) {
					node.scrollTop = node.scrollHeight - this.prevScrollFromBottom;
				}
			}
		}
	}

	onScroll(e) {
		if (e.target === this.refs.root && this.lastResizeScroll <= (+new Date - 250)) {
			// User is scrolling
			let {scrollTop, scrollHeight, offsetHeight} = this.refs.root;
			this.wasScrolledToBottom = scrollTop + offsetHeight >= scrollHeight;
		}
	}

	onResize() {
		let node = this.refs.root;
		if (this.wasScrolledToBottom) {
			node.scrollTop = SCROLL_BOTTOM;
			this.lastResizeScroll = +new Date;
		}
	}

	render() {
		return (
			<div style={{overflow: "auto"}} ref="root" onScroll={(e) => this.onScroll(e)}>
				{this.props.children}
			</div>
		);
	}
}
