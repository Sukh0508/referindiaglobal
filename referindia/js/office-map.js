/**
 * Contact page — interactive office map (Leaflet + OSM).
 * Markers open popups with real address / phone / email for each region.
 */
(function () {
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function popupHtml(title, addressLines, rows) {
    var addr = addressLines.map(function (line) {
      return "<p class=\"office-popup-address\">" + escapeHtml(line) + "</p>";
    }).join("");
    var extra = rows
      .map(function (r) {
        return (
          "<p class=\"office-popup-row\"><strong>" +
          escapeHtml(r.label) +
          ":</strong> " +
          r.html +
          "</p>"
        );
      })
      .join("");
    return (
      '<div class="office-popup-inner">' +
      '<h4 class="office-popup-title">' +
      escapeHtml(title) +
      "</h4>" +
      addr +
      extra +
      "</div>"
    );
  }

  function initOfficeMap() {
    var el = document.getElementById("officeLocationsMap");
    if (!el || typeof L === "undefined") return;

    // Approximate coordinates at each office area (geocoded to street / city level).
    var offices = [
      {
        lat: 19.2975,
        lng: 72.8619,
        popup: popupHtml(
          "India — Mumbai",
          [
            "11/1908, Sunteck MAXXWorld, Naigaon East Vasai Link Rd, Tivri, Naigaon East, Mumbai, Maharashtra – 401208",
          ],
          [
            {
              label: "Phone",
              html: '<a href="tel:+919702053758">+91 9702053758</a>',
            },
            {
              label: "Email",
              html: '<a href="mailto:care@referindia.in">care@referindia.in</a>',
            },
          ]
        ),
      },
      {
        lat: 25.2425,
        lng: 55.3028,
        popup: popupHtml(
          "Middle East — Dubai",
          ["Al Karama, Dubai, UAE"],
          [
            {
              label: "Phone",
              html: '<a href="tel:+971555286876">+971 555286876</a>',
            },
            {
              label: "Email",
              html: '<a href="mailto:team@refermiddleeast.ae">team@refermiddleeast.ae</a>',
            },
          ]
        ),
      },
      {
        lat: 41.9058,
        lng: -1.7207,
        popup: popupHtml(
          "Europe — Spain",
          ["Tarazona, Zaragoza, Spain"],
          [
            {
              label: "Email",
              html: '<a href="mailto:contact@refer-europe.com">contact@refer-europe.com</a>',
            },
          ]
        ),
      },
    ];

    var map = L.map(el, {
      scrollWheelZoom: false,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    var markers = [];
    offices.forEach(function (o) {
      var m = L.marker([o.lat, o.lng]).addTo(map);
      m.bindPopup(o.popup, {
        maxWidth: 320,
        className: "office-leaflet-popup",
        autoPan: true,
        autoPanPadding: [20, 20],
        closeButton: true,
        autoClose: true,
      });
      markers.push(m);
    });

    var group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.28));

    // First interaction: allow scroll-wheel zoom on map (avoids trapping page scroll).
    map.once("click", function () {
      map.scrollWheelZoom.enable();
    });

    // Fix size when layout / fonts settle (embedded in flex layout).
    function invalidate() {
      map.invalidateSize();
      if (markers.length) {
        map.fitBounds(group.getBounds().pad(0.28));
      }
    }
    requestAnimationFrame(function () {
      setTimeout(invalidate, 50);
      setTimeout(invalidate, 400);
    });
    window.addEventListener("resize", invalidate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOfficeMap);
  } else {
    initOfficeMap();
  }
})();
