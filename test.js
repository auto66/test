'undefined' === typeof BattleCalc && (BattleCalc = {});
BattleCalc.round = function (a, c) {
  return Math.round(a * Math.pow(10, c)) / Math.pow(10, c);
};
BattleCalc.getWearBonus = function () {
  var a = {
      defense: 0,
      offense: 0,
      resistance: 0,
      damage: 0,
    },
    c = { damage_min: 50, damage_max: 110 };
  'left_arm' == d && (c = obj.damage);
  if ('undefined' == typeof Wear) return a;
  var b = [],
    e = {},
    d;
  for (d in Wear.wear)
    Wear.wear.hasOwnProperty(d) &&
      b.push(Wear.wear[d].getId());
  if (ItemManager.isLoaded())
    for (var f = 0; f < b.length; f++) {
      a = BattleCalc.mergeBonus(
        a,
        BattleCalc.getItemBonus(b[f])
      );
      var g = ItemManager.get(b[f]);
      'left_arm' === g.type &&
        (c = {
          damage_max: (g.getDamage(Character).max)*1.1,
          damage_min: (g.getDamage(Character).min)*1.1,
        });
      null !== g.set &&
        (e.hasOwnProperty(g.set)
          ? e[g.set]++
          : (e[g.set] = 1));
    }
  for (d in e)
    e.hasOwnProperty(d) &&
      (a = BattleCalc.mergeBonus(
        a,
        BattleCalc.getSetBonus(d, e[d])
      ));
  return { bonus: a, weapon: c };
};
BattleCalc.getItemBonus = function (a) {
  var c = {};
  a = ItemManager.get(a);
  if ('undefined' != typeof a.bonus.fortbattle)
    for (var b in a.bonus.fortbattle)
      a.bonus.fortbattle.hasOwnProperty(b) &&
        (c.hasOwnProperty(b)
          ? (c[b] +=
              ItemManager.calculateItemLevelBonus(
                a.item_level,
                a.bonus.fortbattle[b]
              ) + a.bonus.fortbattle[b])
          : (c[b] =
              ItemManager.calculateItemLevelBonus(
                a.item_level,
                a.bonus.fortbattle[b]
              ) + a.bonus.fortbattle[b]));
  if ('undefined' != typeof a.bonus.fortbattlesector)
    for (b in a.bonus.fortbattlesector)
      a.bonus.fortbattlesector.hasOwnProperty(b) &&
        (c.hasOwnProperty(b)
          ? (c[b] +=
              ItemManager.calculateItemLevelBonus(
                a.item_level,
                a.bonus.fortbattlesector[b]
              ) + a.bonus.fortbattlesector[b])
          : (c[b] =
              ItemManager.calculateItemLevelBonus(
                a.item_level,
                a.bonus.fortbattlesector[b]
              ) + a.bonus.fortbattlesector[b]));
  'undefined' != typeof a.bonus.item &&
    (c = BattleCalc.mergeBonus(
      c,
      BattleCalc.getItemTypeBonus(
        a.bonus.item,
        a.item_level
      )
    ));
  return c;
};
BattleCalc.getSetBonus = function (a, c) {
  var b =
    west.storage.ItemSetManager._setList[a].getMergedStages(
      c
    );
  return BattleCalc.getItemTypeBonus(b);
};
BattleCalc.getItemTypeBonus = function (a, c) {
  c = void 0 === c ? 0 : c;
  for (var b = {}, e = 0; e < a.length; e++) {
    var d = a[e];
    if ('fortbattle' === d.type) {
      var f =
        ItemManager.calculateItemLevelBonus(c, d.value) +
        d.value;
      b.hasOwnProperty(d.name)
        ? (b[d.name] += f)
        : (b[d.name] = f);
    } else
      'character' === d.type &&
        ((d = d.bonus),
        'fortbattle' === d.type &&
          ((f = Math.ceil(
            ItemManager.calculateItemLevelBonus(
              c,
              d.value
            ) +
              d.value * Character.level
          )),
          b.hasOwnProperty(d.name)
            ? (b[d.name] += f)
            : (b[d.name] = f)));
  }
  return b;
};
BattleCalc.mergeBonus = function (a, c) {
  for (var b in a)
    c.hasOwnProperty(b) ? (c[b] += a[b]) : (c[b] = a[b]);
  return c;
};
BattleCalc.coreCalc = function (a, c) {
  if ('undefined' !== typeof c && c) {
    var b = BattleCalc.getWearBonus();
    a.bonus.attack = b.bonus.offense;
    a.bonus.defense = b.bonus.defense;
    a.bonus.resistance = b.bonus.resistance;
    a.bonus.damage = b.bonus.damage;
    a.damage = [b.weapon.damage_min, b.weapon.damage_max];
  }
  b = getValue([a.map_position, a.mapPosition], 0);
  var e = getValue([a.char_tower, a.charTower], 0);
  b = {
    0: { off: 0, def: 0 },
    1e4: { off: -25, def: -25 },
    10001: { off: -12.5, def: -12.5 },
    100: { off: 4, def: 6, bon: 8 },
    1: { off: 19, def: 14, bon: 14 },
    2: { off: 26, def: 19, bon: 19 },
    3: { off: 31, def: 23, bon: 23 },
    4: { off: 34, def: 25, bon: 25 },
    5: { off: 35, def: 26, bon: 26 },
    1e3: { off: 4, def: 6 },
    11: { off: 6, def: 11 },
    12: { off: 9, def: 15 },
    13: { off: 10, def: 18 },
    14: { off: 11, def: 19 },
    15: { off: 11, def: 19 },
  }[b];
  var d = e && 'undefined' !== typeof b.bon ? b.bon : 0,
    f = Math.pow(a.skills.pitfall, 0.6),
    g = Math.pow(a.skills.hide, 0.6),
    p = Math.pow(a.skills.dodge, 0.5),
    q = Math.pow(a.skills.aim, 0.5),
    r = a.bonus.attack,
    t = a.bonus.defense,
    u = a.bonus.resistance;
  e = a.bonus.damage;
  var h = a.damage,
    l =
      'worker' == a.charClass ? (a.premium ? 1.6 : 1.2) : 1,
    n = a.skills.leadership,
    m = Math.pow(
      n *
        ('soldier' == a.charClass
          ? a.premium
            ? 1.5
            : 1.25
          : 1),
      0.5
    ),
    k =
      90 +
      a.skills.health *
        ('soldier' == a.charClass
          ? a.premium
            ? 20
            : 15
          : 10) +
      10 * a.level;
  b = {
    attack: {
      hit: BattleCalc.round(
        ((b.off + 100) / 100) *
          (25 + m + q + g + r) *
          ((d + 100) / 100) *
          l,
        2
      ),
      dodge: BattleCalc.round(
        ((b.def + 100) / 100) *
          (10 + m + p + g + t) *
          ((d + 100) / 100) *
          l,
        2
      ),
      resistance: BattleCalc.round(
        ((300 * a.skills.hide) / k + u) + 25,
        2
      ),
    },
    defense: {
      hit: BattleCalc.round(
        ((b.off + 100) / 100) *
          (25 + m + q + f + r) *
          ((d + 100) / 100) *
          l,
        2
      ),
      dodge: BattleCalc.round(
        ((b.def + 100) / 100) *
          (10 + m + p + f + t) *
          ((d + 100) / 100) *
          l,
        2
      ),
      resistance: BattleCalc.round(
        ((300 * a.skills.pitfall) / k + u) + 25,
        2
      ),
    },
    health: k,
    damage: Math.round(
      Number(h[0]) + e + ((Number(h[0]) + e) * n) / k
    ),
  };
  1 < h.length &&
    (b.damage +=
      '-' +
      Math.round(
        Number(h[1]) + e + ((Number(h[1]) + e) * n) / k
      ));
  return b;
};
function getValue(a, c) {
  for (var b = c, e = 0; e < a.length; e++)
    'undefined' != typeof a[e] && (b = a[e]);
  return b;
}
