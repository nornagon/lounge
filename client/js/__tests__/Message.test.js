import React from "react";
import {shallow} from "enzyme";

import Message, {Actions} from "../Message";
import {LinkerizedText, UserName} from "../util";

describe("Basic functionality", () => {
	it("renders a simple message", () => {
		const message = {
			id: 0,
			type: "message",
			time: 0,
			from: "test-user",
			mode: " ",
			text: "text"
		};
		const wrapper = shallow(<Message message={message} />);
		expect(wrapper.contains(<LinkerizedText text={message.text} />)).toBeTruthy();
		expect(wrapper.contains(<UserName nick={message.from} mode={message.mode} />)).toBeTruthy();
		expect(wrapper.find("span.time").length).toBe(1);
	});
});

describe("Message types", () => {
	it("unhandled", () => {
		const data = {params: ["one", "two", "three"]};
		const wrapper = shallow(<Actions.unhandled {...data} />);
		for (let p of data.params) {
			expect(wrapper.contains(p)).toBeTruthy();
		}
	});
	it("action", () => {
		const data = {from: "nornagon", mode: "+", text: "eats a burrito"};
		const wrapper = shallow(<Actions.action {...data} />);
		expect(wrapper.contains(<UserName nick={data.from} mode={data.mode} />)).toBeTruthy();
		expect(wrapper.contains(<LinkerizedText text={data.text} />)).toBeTruthy();
	});
	it("invite someone else", () => {
		const data = {from: "astorije", invitedYou: false, invited: "someone", channel: "#thelounge"};
		const wrapper = shallow(<Actions.invite {...data} />);
		expect(wrapper.contains(<UserName nick={data.from} />)).toBeTruthy();
		expect(wrapper.contains(<UserName nick={data.invited} />)).toBeTruthy();
		expect(wrapper.contains(<LinkerizedText text={data.channel} />)).toBeTruthy();
	});
	it("invite you", () => {
		const data = {from: "astorije", invitedYou: true, invited: "nornagon", channel: "#thelounge"};
		const wrapper = shallow(<Actions.invite {...data} />);
		expect(wrapper.contains(<UserName nick={data.from} />)).toBeTruthy();
		expect(wrapper.contains(<UserName nick={data.invited} />)).toBeFalsy();
		expect(wrapper.contains("you")).toBeTruthy();
		expect(wrapper.contains(<LinkerizedText text={data.channel} />)).toBeTruthy();
	});
	// TODO
	it("join", () => {});
	it("kick", () => {});
	it("message", () => {});
	it("mode", () => {});
	it("motd", () => {});
	it("nick", () => {});
	it("notice", () => {});
	it("part", () => {});
	it("quit", () => {});
	it("toggle", () => {});
	it("ctcp", () => {});
	it("topic", () => {});
	it("topic_set_by", () => {});
	it("whois", () => {});
});
