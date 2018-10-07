const utils = require("../utils");
const request = require("request-promise");

const get = () => {
  return new Promise((resolve, reject) => {
    utils.readFileAsync("./static/roster.json")
    .then(raw => {
      const data = JSON.parse(raw.toString());
      data.roster.forEach(item => {
        if(item.role === "tank") item.prio = 0;
        if(item.role === "heal") item.prio = 1;
        if(item.role === "melee") item.prio = 2;
        if(item.role === "range") item.prio = 4;
      })
      data.roster = data.roster.sort((a, b) => {
        return a.prio - b.prio;
      })
      resolve(data);
    });
  });
}

const saveRoster = (r) => {
  return new Promise((resolve, reject) => {
    const roster = {
      roster: r,
      lastUpdate: new Date().getTime()
    }
    utils.writeFileAsync("./static/roster.json", roster)
    .then(() => {
      resolve(roster);
    })
  });
}

// {"name": "Sangrene", "role": "tank || heal || melee || range"}
const add = (newMember) => {
  return new Promise((resolve, reject) => {
    get()
    .then(data => {
      const roster = data.roster;
      roster.push(newMember);
      return saveRoster(roster);
    })
    .then(roster => {
      resolve(roster);
    });
  });
}

// remove by name
const remove = (name) => {
  return new Promise((resolve, reject) => {
    get()
    .then(data => {
      let roster = data.roster;
      roster = roster.filter(item => {
        return item.name !== name;
      });
      return saveRoster(roster);
    })
    .then(roster => {
      resolve(roster);
    })
  });
}

const update = () => {
  return new Promise((resolve, reject) => {
    let members = [];
    get()
    .then(data => {
      members = data.roster;
      const detailsPromises = [];
      members.forEach((item, index) => {
        detailsPromises.push(request(`https://eu.api.battle.net/wow/character/Archimonde/${item.name}?fields=items&locale=fr_FR&apikey=${process.env.BLIZZARD_KEY}`));
      });
      return Promise.all(detailsPromises);
    })
    .then(membersDetails => {
      const roster = [];
      membersDetails.forEach((item, index) => {
        item = JSON.parse(item);
        const updatedMember = members.find(elem => {
          return item.name === elem.name;
        });
        updatedMember.ilvl = item.items.averageItemLevel;
        updatedMember.heart = item.items.neck.itemLevel;
        updatedMember.finger1Enchant = (item.items.finger1.tooltipParams.enchant !== undefined);
        updatedMember.finger2Enchant = (item.items.finger2.tooltipParams.enchant !== undefined);
        updatedMember.mainHandEnchant = (item.items.mainHand.tooltipParams.enchant !== undefined);
        roster.push(updatedMember);
      });

      return saveRoster(roster);
    })
    .then(r => {
      resolve(r);
    })
    .catch(e => {
      console.log(e);
      reject(e);
    });
  });
}

module.exports =  {
  update, get, add, remove
}
