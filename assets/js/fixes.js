/* Lifrooms – hành vi dùng chung: carousel, tab, accordion, menu mobile. */
(function () {
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Carousel (cuộn ngang hoặc trượt bằng transform/--m/--k) ---------- */
  var TRACKS = ".pk-track,.s2-track,.qt-grid,.kh-grid,.mx-track";
  $$(TRACKS).forEach(function (track) {
    var sec = track.closest("section");
    if (!sec || track.__init) return;
    track.__init = 1;
    var real = [].filter.call(track.children, function (c) { return !c.classList.contains("clone"); });
    var n = real.length, hasClone = track.children.length > n, i = 0;
    var groups = $$(".s2-dots,.pk-dots,.mx-dots,.qt-dots,.kh-dots", sec).map(function (g) { return $$("i", g); });
    var step = function () { return track.children[1] ? track.children[1].offsetLeft - track.children[0].offsetLeft : track.clientWidth; };
    var scrolling = function () {
      var o = getComputedStyle(track).overflowX;
      return (o === "auto" || o === "scroll") && track.scrollWidth > track.clientWidth + 2;
    };
    var paint = function () {
      var k = scrolling() ? Math.round(track.scrollLeft / step()) : i % n;
      groups.forEach(function (g) { g.forEach(function (d, x) { d.classList.toggle("on", x === Math.min(k, g.length - 1)); }); });
    };
    var apply = function () {
      track.style.setProperty("--m", i);
      track.style.setProperty("--k", i);
      if (getComputedStyle(track).display === "flex") track.style.transform = "translateX(" + (-i * step()) + "px)";
      paint();
    };
    var instant = function (fn) {
      track.style.transition = "none"; fn(); void track.offsetWidth; track.style.transition = "";
    };
    var visible = function () { return Math.max(1, Math.round(track.parentElement.clientWidth / step())); };
    var go = function (dir) {
      if (scrolling()) {
        var max = track.scrollWidth - track.clientWidth, x = track.scrollLeft + dir * step();
        if (dir > 0 && track.scrollLeft >= max - 4) x = 0;
        if (dir < 0 && track.scrollLeft <= 4) x = max;
        track.scrollTo({ left: x, behavior: "smooth" });
        return;
      }
      if (hasClone) {
        if (dir < 0 && i === 0) instant(function () { i = n; apply(); });
        i += dir;
        apply();
        if (i >= n) setTimeout(function () { instant(function () { i = 0; apply(); }); }, 450);
      } else {
        var max = Math.max(0, n - visible());
        i = i + dir > max ? 0 : i + dir < 0 ? max : i + dir;
        apply();
      }
    };
    $$('button[aria-label="Trước"],button[aria-label="Sau"]', sec).forEach(function (b) {
      b.addEventListener("click", function () { go(b.getAttribute("aria-label") === "Sau" ? 1 : -1); });
    });
    groups.forEach(function (g) {
      g.forEach(function (d, x) {
        d.style.cursor = "pointer";
        d.addEventListener("click", function () {
          if (scrolling()) track.scrollTo({ left: x * step(), behavior: "smooth" });
          else { i = x; apply(); }
        });
      });
    });
    track.addEventListener("scroll", paint, { passive: true });
    var w = innerWidth;
    window.addEventListener("resize", function () { if (innerWidth !== w) { w = innerWidth; i = 0; instant(apply); } });
  });

  /* ---------- Mobile: bỏ ngắt dòng cứng trong tiêu đề để text-wrap cân đối ---------- */
  if (innerWidth < 768) $$(".lf h2 br, .lf .sbig br").forEach(function (br) { if (!br.closest(".pk-title")) br.replaceWith(" "); });

  /* ---------- Tab thị trường (đô thị / du lịch) ---------- */
  $$(".mk-cols").forEach(function (box) {
    var tabs = $$(".mk-tab", box), cards = $$(".mk-card", box);
    tabs.forEach(function (t, x) {
      t.addEventListener("click", function () {
        tabs.forEach(function (o, y) { o.classList.toggle("on", y === x); });
        cards.forEach(function (c, y) { c.classList.toggle("on", y === x); });
      });
    });
  });

  /* ---------- Trang OTA: tab "Lifrooms làm gì" (nội dung 5 tab) ---------- */
  var OTA = [
    null, /* tab 1 giữ nguyên nội dung có sẵn trong HTML */
    [["Đồng bộ trên mọi kênh", "Thiết lập channel manager để giá và phòng trống khớp giữa các kênh."],
     ["Giá theo dữ liệu", "Bảng giá theo mùa, ngày trong tuần, công suất, trong khung giá sàn – giá trần khách sạn duyệt."],
     ["Kiểm tra hằng ngày", "Phát hiện chênh giá, xử lý sai lệch, giảm rủi ro overbooking."]],
    [["Lên lịch khuyến mãi", "Kế hoạch theo mùa, dịp lễ và ngày thấp điểm."],
     ["Chọn chương trình phù hợp", "Đề xuất tham gia chương trình của từng kênh dựa trên chi phí và hiệu quả."],
     ["Đo hiệu quả từng đợt", "So sánh doanh thu, số đêm phòng để điều chỉnh đợt tiếp theo."]],
    [["Tối ưu thứ hạng hiển thị", "Cải thiện nội dung, ảnh, giá cạnh tranh và tỷ lệ chuyển đổi."],
     ["Phản hồi đánh giá", "Trả lời khách kịp thời, đúng giọng thương hiệu."],
     ["Tổng hợp góp ý", "Gom các góp ý lặp lại để khách sạn cải thiện dịch vụ."]],
    [["Báo cáo hằng tuần", "Việc đã làm, thay đổi giá, khuyến mãi đang áp dụng."],
     ["Doanh thu theo kênh", "Doanh thu, công suất, giá trung bình và hoa hồng của từng OTA."],
     ["Theo dõi trên dashboard", "Số liệu cập nhật thường xuyên."]]
  ];
  $$(".b-tabs").forEach(function (bar) {
    var panel = bar.nextElementSibling, stack = panel && panel.querySelector(".stack");
    if (!stack) return;
    var tabs = $$("button", bar), first = stack.innerHTML;
    var cta = stack.querySelector(".b-pbtn").outerHTML;
    var esc = function (t) { return t.replace(/&/g, "&amp;"); };
    tabs.forEach(function (t, x) {
      t.addEventListener("click", function () {
        tabs.forEach(function (o, y) { o.classList.toggle("on", y === x); });
        if (!OTA[x]) { stack.innerHTML = first; return; }
        stack.innerHTML = '<span class="b-ptag">' + t.innerHTML + "</span>" + OTA[x].map(function (r, k) {
          return '<div class="b-tf"><span class="no">0' + (k + 1) + "</span><div><h4>" + esc(r[0]) + "</h4><p>" + esc(r[1]) + "</p></div></div>";
        }).join("") + cta;
      });
    });
  });

  /* ---------- FAQ ---------- */
  $$(".acc > button").forEach(function (b) {
    b.addEventListener("click", function () {
      var a = b.parentElement, o = a.classList.toggle("open");
      b.setAttribute("aria-expanded", o);
    });
  });

  /* ---------- Hero slider ---------- */
  $$(".hb-show").forEach(function (hb) {
    var slides = $$(".hb-slide", hb), dots = $$(".hb-dots button", hb), cur = 0;
    var show = function (k) {
      cur = (k + slides.length) % slides.length;
      slides.forEach(function (s, x) { s.classList.toggle("on", x === cur); });
      dots.forEach(function (d, x) { d.classList.toggle("on", x === cur); });
    };
    $$(".hb-arr", hb).forEach(function (b) {
      b.addEventListener("click", function () { show(cur + (b.getAttribute("aria-label") === "Sau" ? 1 : -1)); });
    });
    dots.forEach(function (d, x) { d.addEventListener("click", function () { show(x); }); });
  });

  /* ---------- Menu mobile: dựng từ mega menu (một nguồn nội dung) ---------- */
  var hdr = document.querySelector(".hdr"), mn = document.querySelector(".mnav"), bg = document.querySelector(".burger");
  if (hdr && mn && bg) {
    var mega = hdr.querySelector(".mega");
    var home = (hdr.querySelector(".logo") || {}).getAttribute && hdr.querySelector(".logo").getAttribute("href");
    var plain = $$(".nav > a", hdr);
    var h = '<div class="mn-body"><div class="mn-grp open"><button type="button" class="mn-dd" aria-expanded="true">Dịch vụ <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg></button><div class="mn-sub">';
    if (mega) $$(".mega-col", mega).forEach(function (col) {
      h += '<span class="mn-pill">' + col.querySelector("h5").textContent + "</span>";
      $$("a.mi", col).forEach(function (a) { h += a.outerHTML; });
    });
    h += "</div></div>";
    plain.forEach(function (a) { h += '<a class="mn-l" href="' + a.getAttribute("href") + '">' + a.textContent + "</a>"; });
    h += '</div><div class="mn-cta"><a class="btn btn-o" href="#">Đăng nhập</a><a class="btn btn-p" href="#form">Dùng thử</a></div>';
    mn.innerHTML = h;
    var ico = bg.innerHTML, closeIco = '<svg viewBox="0 0 24 24" class="ico" style="width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    var set = function (open) {
      mn.classList.toggle("show", open);
      document.documentElement.classList.toggle("mn-open", open);
      bg.innerHTML = open ? closeIco : ico;
      bg.setAttribute("aria-expanded", open);
    };
    // thay handler cũ (chỉ toggle .show) bằng handler có icon X + khoá cuộn
    var nb = bg.cloneNode(true); bg.parentNode.replaceChild(nb, bg); bg = nb;
    bg.addEventListener("click", function () { set(!mn.classList.contains("show")); });
    mn.querySelector(".mn-dd").addEventListener("click", function () {
      var g = this.parentElement, o = g.classList.toggle("open"); this.setAttribute("aria-expanded", o);
    });
    $$("a", mn).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }
})();
