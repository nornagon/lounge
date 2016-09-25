import React from "react";
import classNames from "classnames";

import {LinkerizedText, UserName} from "./util";

function tz(time) {
	time = new Date(time);
	var h = time.getHours();
	var m = time.getMinutes();

	if (h < 10) {
		h = "0" + h;
	}

	if (m < 10) {
		m = "0" + m;
	}

	return h + ":" + m;
}

// Exported for testing.
export const Actions = {
	action: ({mode, from, text}) =>
		<span>
			<UserName nick={from} mode={mode} /> <span className="action-text"><LinkerizedText text={text} /></span>
		</span>,

	join: ({from, mode, hostmask}) =>
		<span>
			<UserName mode={mode} nick={from} />
			{" "}<i className="hostmask">({hostmask})</i>
			{" "}has joined the channel
		</span>,

	part: ({from, mode, hostmask, text}) =>
		<span>
			<UserName mode={mode} nick={from} />
			{" "}<i className="hostmask">({hostmask})</i>
			{" "}has left the channel
			{" "}{text ?
				<i className="part-reason">(<LinkerizedText text={text} />)</i>
				: null}
		</span>,

	quit: ({from, mode, hostmask, text}) =>
		<span>
			<UserName mode={mode} nick={from} />
			{" "}<i className="hostmask">({hostmask})</i>
			{" "}has quit
			{" "}{text ?
				<i className="part-reason">(<LinkerizedText text={text} />)</i>
				: null}
		</span>,

	mode: ({from, mode, text}) =>
		<span>
			<UserName mode={mode} nick={from} />
			{" "}sets mode <LinkerizedText text={text} />
		</span>,

	topic_set_by: ({nick, mode, when}) =>
		<span>
			Topic set by
			{" "}<UserName mode={mode} nick={nick} />
			{" "}on {new Date(when).toLocaleString()}
		</span>,

	topic: ({from, mode, text}) =>
		<span>
			{from
				? <span><UserName mode={mode} nick={from} /> has changed the topic to: </span>
				: <span>The topic is: </span>
			}
			<span className="new-topic"><LinkerizedText text={text} /></span>
		</span>,

	nick: ({nick, mode, new_nick}) =>
		<span>
			<UserName mode={mode} nick={nick} /> is now known as <UserName mode={mode} nick={new_nick} />
		</span>,

	ctcp: ({from, ctcpType, ctcpMessage}) =>
		<span>
			<UserName nick={from} />
			<b>{ctcpType}</b> <LinkerizedText text={ctcpMessage} />
		</span>,

	kick: ({mode, from, target, text}) =>
		<span>
			<UserName mode={mode} nick={from} /> has kicked <UserName nick={target} />
			{text
				? <i className="part-reason">(<LinkerizedText text={text} />)</i>
				: null}
		</span>,

	invite: ({from, invitedYou, invited, channel}) => {
		let invitee = invitedYou ? "you" : <UserName nick={invited} />;
		return <span>
			<UserName nick={from} /> invited {invitee} to <LinkerizedText text={channel} />
		</span>;
	},

	whois: ({whois}) =>
		<span>
			<div>
				<UserName nick={whois.nick} /> <i className="hostmask">({whois.user}@{whois.host})</i>: <b>{whois.real_name}</b>
			</div>
			{whois.account &&
				<div><UserName nick={whois.nick} /> is logged in as <b>{whois.account}</b></div>}
			{whois.channels &&
				<div><UserName nick={whois.nick} /> is on the following channels: <LinkerizedText text={whois.channels} /></div>}
			{whois.server &&
				<div><UserName nick={whois.nick} /> is connected to {whois.server} <i>({whois.server_info})</i></div>}
			{whois.secure &&
				<div><UserName nick={whois.nick} /> is using a secure connection</div>}
			{whois.away &&
				<div><UserName nick={whois.nick} /> is away <i>({whois.away})</i></div>}
		</span>,

	toggle: ToggleablePreview,

	unhandled: ({params}) =>
		<span>
			{params.map((p, i) => <span key={i}> {p}</span>)}
		</span>,
};

const Preview = {
	image: ({link, onLoad}) =>
		<a href={link} target="_blank" rel="noopener noreferrer">
			<img src={link} onLoad={onLoad} />
		</a>,
	link: ({head, body, thumb, link, onLoad}) =>
		<a href={link} target="_blank" rel="noopener noreferrer">
			{thumb ?
				<img src={thumb} className="thumb" onLoad={onLoad} />
				: null}
			<div className="head">{head}</div>
			<div className="body">{body}</div>
		</a>,
};

class ToggleablePreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isOpen: false};
	}
	render() {
		let {previewData: data} = this.props;
		return (
			<div>
				<div className="force-newline">
					<button
						className="toggle-button"
						aria-label="Toggle prefetched media"
						onClick={() => this.toggle()}
					>···</button>
				</div>
				<div className={classNames("toggle-content", {show: this.props.isOpen})}>
					{data && React.createElement(Preview[data.type], {data})}
				</div>
			</div>
		);
	}
	toggle() {
		this.setState({isOpen: !this.state.isOpen});
	}
}

const Message = ({message}) => {
	var from, content;

	if (message.from && !(message.type in Actions)) {
		from = <UserName nick={message.from} mode={message.mode} />;
	} else if (message.type === "unhandled") {
		from = <span>[{message.command}]</span>;
	}

	if (message.type in Actions) {
		content = React.createElement(Actions[message.type], message);
	} else {
		content = <LinkerizedText text={message.text} />;
	}

	return (
		<div
			className={
				classNames(
					"msg",
					message.type,
					{self: message.self, highlight: message.highlight}
				)
			}
			id={`msg-${message.id}`}
		>
			<span className="time">{tz(message.time)}</span>
			{" "}
			<span className="from">{from}</span>
			{" "}
			<span className="text">{content}</span>
		</div>
	);
}

export default Message;
