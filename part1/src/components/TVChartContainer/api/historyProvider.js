var rp = require('request-promise').defaults({json: true});
let first = true;

const api_root = 'https://min-api.cryptocompare.com'
const history = {}

export default {
	history: history,

    getBars: function(symbolInfo, resolution, from, to, limit) {
		// console.log("symbol info: ", symbolInfo);
		// console.log("resolution: ", resolution);
		// console.log("periodParams: ", periodParams);
		// console.log("back: ", onHistoryCallback);
		// console.log("error", onErrorCallback);
		// console.log("a:", a);
		// console.log("b: ", b);
		// const limit = 2000;
		// const from = periodParams.from;
		// const to = periodParams.to;
		// const to = 1669309898;
		var split_symbol = symbolInfo.name.split(/[:/]/)
			const url = resolution === 'D' ? '/data/histoday' : resolution >= 60 ? '/data/histohour' : '/data/histominute'
			const qs = {
					e: split_symbol[0],
					fsym: split_symbol[1],
					tsym: split_symbol[2],
					toTs:  to ? to : '',
					limit: 2000, 
					// aggregate: 1//resolution 
				}
			// console.log({qs})
		console.log("rp la gi: ", qs);
        return rp({
                url: `${api_root}${url}`,
                qs,
            })
            .then(data => {
				console.log("data la gi: ", data);
                console.log({data})
				if (data.Response && data.Response === 'Error') {
					console.log('CryptoCompare API error:',data.Message)
					return []
				}
				if (data.Data.length) {
					console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
					var bars = data.Data.map(el => {
						return {
							time: el.time * 1000, //TradingView requires bar time in ms
							low: el.low,
							high: el.high,
							open: el.open,
							close: el.close,
							volume: el.volumefrom 
						}
					})
						if (first) {
							var lastBar = bars[bars.length - 1]
							history[symbolInfo.name] = {lastBar: lastBar}
						}
					console.log("barssss: ", bars);
					return bars
				} else {
					console.log("aaaaaaaaaa");
					return []
				}
			})
}
}
