import * as actions from "../actions";

export default function activeChannelId(state = null, action) {
	switch (action.type) {
	case actions.INITIAL_DATA_RECEIVED:
		if (action.data.active < 0) {
			for (let network of action.data.networks) {
				return network.channels[0].id;
			}
		}
		return action.data.active;
	case actions.CHANGE_ACTIVE_CHANNEL:
		return action.channelId;
	case actions.JOINED_NETWORK: {
		let {networkInitialData: {channels}} = action;
		return channels[channels.length - 1].id;
	}
	case actions.JOINED_CHANNEL: {
		let {networkId, channelInitialData} = action;
		if (channelInitialData.type !== "query" || channelInitialData.shouldOpen) {
			return channelInitialData.id;
		} else {
			return state;
		}
	}

	default:
		return state;
	}
}
