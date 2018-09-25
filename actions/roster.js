const utils = require("../utils");
const request = require("request-promise");



const get = () => {
  return new Promise((resolve, reject) => {
    utils.readFileAsync("./static/roster.json")
    .then(data => {
      resolve(JSON.parse(data.toString()));
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

const update = () => {
  return new Promise((resolve, reject) => {
    utils.readFileAsync("./static/roster.json")
    .then(data => {
      const members = JSON.parse(data.toString()).roster;
      const detailsPromises = [];
      members.forEach((item, index) => {
        detailsPromises.push(request(`https://eu.api.battle.net/wow/character/Archimonde/${item.name}?fields=items&locale=fr_FR&apikey=jjtzqybzdxhk5wgacsmretxdnv88yssr`));
      });
      Promise.all(detailsPromises)
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

        saveRoster(roster)
        .then(r => {
          resolve(r);
        });
      })
      .catch(e => {
        reject(e);
      });
    });
  });
}

module.exports =  {
  update, get
}
