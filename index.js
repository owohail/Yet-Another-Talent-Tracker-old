// perfection is bloated
const SOFTCAP = 0.8901403358192
const Prim = "#9f80ff", Seco = "#bf80ff", Tert = "#df80ff", Quat = "#ff80ff", Quin = "#ff80df", Sena = "#ff80bf", Gry = "#999999", Wht = "#ffffff", Gre = "#80ff80", Ylw = "#ffff80", yGre = "#bfff7f", Org = "#ffbf80", Red = "#ff8080", dRed = "#ff3333"

module.exports = function YetAnotherTalentTracker(d) {
	const hook = (packet, callback) => { d.hook(packet, '*', callback) }
	let capped = false, lvl = 0, exp = 0, dailyExp = 0, dailyCap = 0, ep = 0, usedPoints = 0, dailySoftcap = 0;
	let gained = 0;

	for (let set of [ 'S_LOAD_EP_INFO', 'S_CHANGE_EP_EXP_DAILY_LIMIT' ]) hook(set, (e) => {
		if (set == 'S_LOAD_EP_INFO'){ dailyCap = e.dailyExpMax; exp = e.exp; lvl = e.level; dailyExp = e.dailyExp; dailyCap = e.dailyExpMax; ep = e.totalPoints; usedPoints = e.usedPoints; }
		if (set == 'S_CHANGE_EP_EXP_DAILY_LIMIT'){ dailyCap = e.limit; }
		dailySoftcap = Math.floor(dailyCap * SOFTCAP);
    })

	d.hook('S_PLAYER_CHANGE_EP', '*', (e) => {
		gained = e.expDifference; exp = e.exp; lvl = e.level; dailyExp = e.dailyExp; dailyCap = e.dailyExpMax; ep = e.totalPoints; dailySoftcap = Math.floor(dailyCap * SOFTCAP);
		if (gained) {
			if (dailyExp >= dailySoftcap) {
				if (!capped) {
					d.command.message(`<font color="${Red}">Daily softcap met! Further EP EXP will be severely reduced.</font>`)
					capped = true
				}
			}
			else capped = false
			d.command.message(`${capped ? `<font color="${Ylw}">+${gained} EP EXP (softcapped)</font> <font color="${Gry}">(Total: ${dailyExp} / ${dailySoftcap})</font>` : `<font color="${Gre}">+${gained} EP EXP</font> <font color="${Gry}">(Total: ${dailyExp} / ${dailySoftcap})</font>`}`)
		}
	})

	d.hook('C_REQUEST_CONTRACT', '*', (e) => { if (e.type == 78) msg() })

	function msg() {
		d.command.message(`<font color="${Gry}">{</font> <font color="${Prim}">Yet Another EP Tracker <font color="${Gry}">==></font> Level ${ep}</font> <font color="${Gry}">}</font> \n<font color="${Prim}">Used Points:</font> <font color="${Seco}">${usedPoints}<font color="${Gry}"> / </font>${ep}</font> \n<font color="${Prim}">Daily EXP:</font> <font color="${Seco}">${dailyExp} <font color="${Gry}">/</font> ${dailySoftcap}</font> <font color="${Gry}">(${Math.round(100 * dailyExp / dailySoftcap)}%)</font>`)
	}
}