const T = Symbol("ChlSymbol");
function w(e, t, n) {
  if (!e || typeof e[t] != "function" || e[T])
    return;
  const o = e[t];
  e[t] = function(...f) {
    return n.call(this, (...h) => o && o.apply(this, h), f);
  }, e[T] = !0;
}
const S = () => ({
  info: function(e) {
    console.info("%c CustomHookLoader ", "background: #E8711C; color: #fff", e);
  },
  warn: function(e) {
    console.info("%c CustomHookLoader ", "background: #183461; color: #fff", e);
  }
}), O = async (e) => {
  const t = S();
  let n = [];
  const o = await PluginFS.ls(`./hooks/${e}`), h = await import(`./hooks/${e}/_remote.js`), p = [];
  for (const a of o) {
    if (a.startsWith("_"))
      continue;
    const u = `./hooks/${e}/` + a;
    p.push(import(u)), t.info(`Registered ${e} hook from: ${u}`);
  }
  for (const a of h.default)
    p.push(import(a)), t.info(`Registered ${e} hook from: ${a}`);
  const r = await Promise.all(p);
  for (const a of r)
    n.push(...a.default);
  return n;
}, A = (e, t) => {
  w(e.Component, "extend", function(n, o) {
    let f = n(...o);
    const h = o.filter((r) => typeof r == "object" && r.classNames && Array.isArray(r.classNames)).map((r) => r.classNames.join(" "));
    return t.filter((r) => r.matcher === h[0]).forEach((r) => {
      const a = r.mixin;
      typeof a == "function" && (f = f.extend(a(e, o))), r.wraps && r.wraps.length > 0 && r.wraps.forEach((u) => {
        w(f.proto(), u.name, u.replacement);
      });
    }), f;
  });
}, M = (e) => {
  e.rcp.postInit("rcp-fe-ember-libs", async (t) => {
    const n = await O("ember");
    w(t, "getEmber", function(o, f) {
      return o(...f).then((p) => (A(p, n), p));
    });
  });
};
var m = ["load", "loadend", "timeout", "error", "readystatechange", "abort"], y = "__origin_xhr";
function C(e, t) {
  var n = {};
  for (var o in e)
    n[o] = e[o];
  return n.target = n.currentTarget = t, n;
}
function X(e, t) {
  t = t || window;
  var n = t.XMLHttpRequest;
  t.XMLHttpRequest = function() {
    for (var r = new n(), a = 0; a < m.length; ++a) {
      var u = "on" + m[a];
      r[u] === void 0 && (r[u] = null);
    }
    for (var d in r) {
      var E = "";
      try {
        E = typeof r[d];
      } catch {
      }
      E === "function" ? this[d] = h(d) : d !== y && Object.defineProperty(this, d, {
        get: o(d),
        set: f(d),
        enumerable: !0
      });
    }
    var s = this;
    r.getProxy = function() {
      return s;
    }, this[y] = r;
  }, Object.assign(t.XMLHttpRequest, { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 });
  function o(r) {
    return function() {
      var a = this.hasOwnProperty(r + "_") ? this[r + "_"] : this[y][r], u = (e[r] || {}).getter;
      return u && u(a, this) || a;
    };
  }
  function f(r) {
    return function(a) {
      var u = this[y], d = this, E = e[r];
      if (r.substring(0, 2) === "on")
        d[r + "_"] = a, u[r] = function(i) {
          i = C(i, d);
          var c = e[r] && e[r].call(d, u, i);
          c || a.call(d, i);
        };
      else {
        var s = (E || {}).setter;
        a = s && s(a, d) || a, this[r + "_"] = a;
        try {
          u[r] = a;
        } catch {
        }
      }
    };
  }
  function h(r) {
    return function() {
      var a = [].slice.call(arguments);
      if (e[r]) {
        var u = e[r].call(this, a, this[y]);
        if (u)
          return u;
      }
      return this[y][r].apply(this[y], a);
    };
  }
  function p() {
    t.XMLHttpRequest = n, n = void 0;
  }
  return { originXhr: n, unHook: p };
}
var $ = m[0], j = m[1], D = m[2], F = m[3], _ = m[4], I = m[5], R = "prototype";
function G(e, t) {
  return t = t || window, V(e, t);
}
function W(e) {
  return e.replace(/^\s+|\s+$/g, "");
}
function N(e) {
  return e.watcher || (e.watcher = document.createElement("a"));
}
function H(e, t) {
  var n = e.getProxy(), o = "on" + t + "_", f = C({ type: t }, n);
  n[o] && n[o](f);
  var h;
  typeof Event == "function" ? h = new Event(t, { bubbles: !1 }) : (h = document.createEvent("Event"), h.initEvent(t, !1, !0)), N(e).dispatchEvent(h);
}
function k(e) {
  this.xhr = e, this.xhrProxy = e.getProxy();
}
k[R] = /* @__PURE__ */ Object.create({
  resolve: function(t) {
    var n = this.xhrProxy, o = this.xhr;
    n.readyState = 4, o.resHeader = t.headers, n.response = n.responseText = t.response, n.statusText = t.statusText, n.status = t.status, H(o, _), H(o, $), H(o, j);
  },
  reject: function(t) {
    this.xhrProxy.status = 0, H(this.xhr, t.type), H(this.xhr, j);
  }
});
function x(e) {
  function t(n) {
    k.call(this, n);
  }
  return t[R] = Object.create(k[R]), t[R].next = e, t;
}
var B = x(function(e) {
  var t = this.xhr;
  e = e || t.config, t.withCredentials = e.withCredentials, t.open(e.method, e.url, e.async !== !1, e.user, e.password);
  for (var n in e.headers)
    t.setRequestHeader(n, e.headers[n]);
  t.send(e.body);
}), K = x(function(e) {
  this.resolve(e);
}), U = x(function(e) {
  this.reject(e);
});
function V(e, t) {
  var n = e.onRequest, o = e.onResponse, f = e.onError;
  function h(s, i) {
    var c = new K(s), v = i.responseType, l = !v || v === "text" || v === "json" ? i.responseText : i.response, g = {
      response: l,
      //ie9
      status: i.status,
      statusText: i.statusText,
      config: s.config,
      headers: s.resHeader || s.getAllResponseHeaders().split(`\r
`).reduce(function(b, L) {
        if (L === "")
          return b;
        var P = L.split(":");
        return b[P.shift()] = W(P.join(":")), b;
      }, {})
    };
    if (!o)
      return c.resolve(g);
    o(g, c);
  }
  function p(s, i, c, v) {
    var l = new U(s);
    c = { config: s.config, error: c, type: v }, f ? f(c, l) : l.next(c);
  }
  function r() {
    return !0;
  }
  function a(s) {
    return function(i, c) {
      return p(i, this, c, s), !0;
    };
  }
  function u(s, i) {
    return s.readyState === 4 && s.status !== 0 ? h(s, i) : s.readyState !== 4 && H(s, _), !0;
  }
  var { originXhr: d, unHook: E } = X({
    onload: r,
    onloadend: r,
    onerror: a(F),
    ontimeout: a(D),
    onabort: a(I),
    onreadystatechange: function(s) {
      return u(s, this);
    },
    open: function(i, c) {
      var v = this, l = c.config = { headers: {} };
      l.method = i[0], l.url = i[1], l.async = i[2], l.user = i[3], l.password = i[4], l.xhr = c;
      var g = "on" + _;
      if (c[g] || (c[g] = function() {
        return u(c, v);
      }), n)
        return !0;
    },
    send: function(s, i) {
      var c = i.config;
      if (c.withCredentials = i.withCredentials, c.body = s[0], n) {
        var v = function() {
          n(c, new B(i));
        };
        return c.async === !1 ? v() : setTimeout(v), !0;
      }
    },
    setRequestHeader: function(s, i) {
      if (i.config.headers[s[0].toLowerCase()] = s[1], n)
        return !0;
    },
    addEventListener: function(s, i) {
      var c = this;
      if (m.indexOf(s[0]) !== -1) {
        var v = s[1];
        return N(i).addEventListener(s[0], function(l) {
          var g = C(l, c);
          g.type = s[0], g.isTrusted = !0, v.call(c, g);
        }), !0;
      }
    },
    getAllResponseHeaders: function(s, i) {
      var c = i.resHeader;
      if (c) {
        var v = "";
        for (var l in c)
          v += l + ": " + c[l] + `\r
`;
        return v;
      }
    },
    getResponseHeader: function(s, i) {
      var c = i.resHeader;
      if (c)
        return c[(s[0] || "").toLowerCase()];
    }
  }, t);
  return {
    originXhr: d,
    unProxy: E
  };
}
const z = (e) => {
  G({
    onRequest: (t, n) => {
      e.filter((o) => typeof o.matcher == "string" && o.matcher === t.url).forEach((o) => {
        o.preSend(t);
      }), n.next(t);
    },
    onResponse: (t, n) => {
      e.filter((o) => typeof o.matcher == "string" && o.matcher === t.config.url).forEach((o) => {
        o.postSend(t);
      }), n.next(t);
    }
  });
}, J = (e) => {
  e.rcp.postInit("rcp-fe-lol-l10n", async () => {
    const t = await O("xhr");
    z(t);
  });
};
function Q(e) {
  M(e), J(e);
}
export {
  Q as init
};
