
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('form.ajax-form').forEach(function(form){
    const statusEl = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(statusEl){ statusEl.textContent = 'Sending...'; statusEl.className = 'form-status'; }
      if(submitBtn){ submitBtn.disabled = true; }
      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          if(statusEl){ statusEl.textContent = "Thanks! We'll be in touch shortly."; statusEl.className = 'form-status success'; }
          form.reset();
        } else {
          if(statusEl){ statusEl.textContent = 'Something went wrong. Please call us instead.'; statusEl.className = 'form-status error'; }
        }
      })
      .catch(function(){
        if(statusEl){ statusEl.textContent = 'Something went wrong. Please call us instead.'; statusEl.className = 'form-status error'; }
      })
      .finally(function(){
        if(submitBtn){ submitBtn.disabled = false; }
      });
    });
  });
});

(function(){
  const card = document.getElementById('quote-form');
  if(!card) return;
  const tabs = card.querySelectorAll('.estimate-tab');
  const panels = card.querySelectorAll('.estimate-panel');
  const totalDisplay = document.getElementById('estimateTotalDisplay');
  const serviceField = document.getElementById('estimateService');
  const detailsField = document.getElementById('estimateDetails');
  const totalField = document.getElementById('estimateTotalField');
  if(!tabs.length) return;

  let activeTab = 'carpet';

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      activeTab = tab.dataset.tab;
      tabs.forEach(function(t){ t.classList.toggle('active', t === tab); });
      panels.forEach(function(p){ p.hidden = (p.dataset.panel !== activeTab); });
      recalc();
    });
  });

  const UPHOLSTERY_ITEMS = [
    { label: 'Armchair / Accent Chair', price: 64 },
    { label: 'Loveseat (2-seater)', price: 114 },
    { label: 'Sofa (3-seater)', price: 154 },
    { label: 'Sectional / L-Shape', price: 279, approx: true },
    { label: 'Recliner', price: 84 },
    { label: 'Chaise Lounge', price: 104 },
    { label: 'Ottoman', price: 30 },
    { label: 'Dining Chair', price: 25, approx: true },
    { label: 'Set of 4 Dining Chairs', price: 84 },
    { label: 'Bar Stool', price: 20 },
    { label: 'Office Chair', price: 39, approx: true },
    { label: 'Upholstered Headboard', price: 60 }
  ];

  const uphItems = document.getElementById('uphItems');
  const uphAddBtn = document.getElementById('uphAddBtn');

  function buildUphSelect(){
    const select = document.createElement('select');
    select.className = 'uph-select';
    UPHOLSTERY_ITEMS.forEach(function(item, i){
      const opt = document.createElement('option');
      opt.value = item.price;
      opt.dataset.label = item.label;
      opt.textContent = item.label + ' — ' + (item.approx ? '~' : '') + '$' + item.price;
      if(i === 0) opt.selected = true;
      select.appendChild(opt);
    });
    return select;
  }

  function addUphRow(){
    if(!uphItems) return;
    const row = document.createElement('div');
    row.className = 'uph-item-row';

    const select = buildUphSelect();

    const qty = document.createElement('input');
    qty.type = 'number';
    qty.className = 'uph-qty';
    qty.value = '1';
    qty.min = '1';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'uph-remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', function(){
      row.remove();
      recalc();
    });

    row.appendChild(select);
    row.appendChild(qty);
    row.appendChild(removeBtn);
    uphItems.appendChild(row);

    select.addEventListener('change', recalc);
    qty.addEventListener('input', recalc);

    recalc();
  }

  if(uphAddBtn) uphAddBtn.addEventListener('click', addUphRow);
  if(uphItems) addUphRow();

  const sqftInput = document.getElementById('carpetSqft');
  if(sqftInput) sqftInput.addEventListener('input', recalc);

  const mattressSize = document.getElementById('mattressSize');
  if(mattressSize) mattressSize.addEventListener('change', recalc);
  card.querySelectorAll('input[name="mattressSides"]').forEach(function(r){
    r.addEventListener('change', recalc);
  });
  const mattressInclude = document.getElementById('mattressInclude');
  if(mattressInclude) mattressInclude.addEventListener('change', recalc);

  function recalc(){
    let total = 0;
    const parts = [];

    const sqft = parseFloat(sqftInput && sqftInput.value) || 0;
    if(sqft > 0){
      const rate = sqft >= 500 ? 0.38 : 0.45;
      const carpetTotal = Math.max(sqft * rate, 134);
      total += carpetTotal;
      parts.push(`Carpet Cleaning - ${sqft} sq ft @ $${rate}/sq ft = $${carpetTotal.toFixed(2)}`);
    }

    const items = [];
    let upholsteryTotal = 0;
    if(uphItems) uphItems.querySelectorAll('.uph-item-row').forEach(function(row){
      const select = row.querySelector('.uph-select');
      const qtyInput = row.querySelector('.uph-qty');
      const qty = parseInt(qtyInput && qtyInput.value, 10) || 0;
      if(qty > 0 && select){
        const price = parseFloat(select.value) || 0;
        const label = select.options[select.selectedIndex].dataset.label;
        upholsteryTotal += price * qty;
        items.push(`${qty}x ${label} ($${price} each)`);
      }
    });
    if(items.length){
      total += upholsteryTotal;
      parts.push(`Upholstery - ${items.join(', ')} = $${upholsteryTotal.toFixed(2)}`);
    }

    const mattressChecked = document.getElementById('mattressInclude');
    if(mattressChecked && mattressChecked.checked){
      const base = parseFloat(mattressSize && mattressSize.value) || 0;
      const sidesEl = card.querySelector('input[name="mattressSides"]:checked');
      const multiplier = sidesEl ? parseFloat(sidesEl.value) : 1;
      const mattressTotal = base * multiplier;
      total += mattressTotal;
      const sizeLabel = mattressSize ? mattressSize.options[mattressSize.selectedIndex].textContent : '';
      const sidesLabel = multiplier > 1 ? 'Both Sides' : 'One Side';
      parts.push(`Mattress Cleaning - ${sizeLabel} - ${sidesLabel} = $${mattressTotal.toFixed(2)}`);
    }

    const details = parts.length ? parts.join(' | ') : 'No services selected yet';

    if(totalDisplay) totalDisplay.textContent = '$' + total.toFixed(2).replace(/\.00$/, '');
    if(serviceField) serviceField.value = parts.length ? parts.length + ' service(s) selected' : 'none';
    if(detailsField) detailsField.value = details;
    if(totalField) totalField.value = '$' + total.toFixed(2);
  }

  recalc();
})();

function toggleMenu(){
  const nav=document.getElementById('navLinks');
  const toggle=document.querySelector('.mobile-toggle');
  if(nav) nav.classList.toggle('active');
  if(toggle) toggle.classList.toggle('active');
}
document.addEventListener('click', function(e){
  if(e.target.matches('.nav-links a')){
    const nav=document.getElementById('navLinks');
    const toggle=document.querySelector('.mobile-toggle');
    if(nav) nav.classList.remove('active');
    if(toggle) toggle.classList.remove('active');
  }
});
function slidePortfolio(direction){
  const track=document.getElementById('portfolioTrack');
  if(!track) return;
  const items=track.querySelectorAll('.portfolio-item');
  const first=items[0];
  const gap=22;
  const amount=first ? first.getBoundingClientRect().width + gap : Math.round(track.clientWidth * 0.85);
  const maxScroll=track.scrollWidth - track.clientWidth;
  let target=track.scrollLeft + direction * amount;
  if(target < 4) target = direction < 0 ? maxScroll : 0;
  else if(target > maxScroll - 4) target = direction > 0 ? 0 : maxScroll;
  track.scrollTo({left: target, behavior:'smooth'});
}

(function(){
  const track=document.getElementById('portfolioTrack');
  const dotsWrap=document.getElementById('portfolioDots');
  if(!track || !dotsWrap) return;
  const items=Array.from(track.querySelectorAll('.portfolio-item'));
  if(!items.length) return;

  items.forEach((item, i)=>{
    const dot=document.createElement('button');
    dot.type='button';
    dot.className='carousel-dot'+(i===0 ? ' active' : '');
    dot.setAttribute('aria-label','Go to photo '+(i+1));
    dot.addEventListener('click', ()=>{
      track.scrollTo({left:item.offsetLeft - track.offsetLeft, behavior:'smooth'});
    });
    dotsWrap.appendChild(dot);
  });
  const dots=Array.from(dotsWrap.children);

  function updateActiveDot(){
    let closest=0;
    let closestDist=Infinity;
    items.forEach((item, i)=>{
      const dist=Math.abs(item.offsetLeft - track.offsetLeft - track.scrollLeft);
      if(dist < closestDist){ closestDist=dist; closest=i; }
    });
    dots.forEach((d, i)=>d.classList.toggle('active', i===closest));
  }

  let scrollTimer;
  track.addEventListener('scroll', ()=>{
    clearTimeout(scrollTimer);
    scrollTimer=setTimeout(updateActiveDot, 80);
  });

  let autoplay=setInterval(()=>slidePortfolio(1), 4500);
  function pauseAutoplay(){ clearInterval(autoplay); }
  function resumeAutoplay(){ clearInterval(autoplay); autoplay=setInterval(()=>slidePortfolio(1), 4500); }
  track.addEventListener('mouseenter', pauseAutoplay);
  track.addEventListener('mouseleave', resumeAutoplay);
  track.addEventListener('touchstart', pauseAutoplay, {passive:true});
  track.addEventListener('touchend', resumeAutoplay);
})();

document.addEventListener('DOMContentLoaded', function(){
  const targets=document.querySelectorAll(
    '.section-head, .service-row, .portfolio-item, .about-grid > *, .step, .county-box, .cta-box, .contact-card, form:not(.quote-form), .faq-item, .blog-card'
  );
  targets.forEach(el=>el.classList.add('reveal'));

  document.querySelectorAll('.service-menu-grid, .process-grid, .cities-list, .blog-grid').forEach(el=>el.classList.add('reveal-group'));

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
    targets.forEach(el=>observer.observe(el));
  } else {
    targets.forEach(el=>el.classList.add('visible'));
  }

  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click', function(){
      const item=btn.closest('.faq-item');
      const isActive=item.classList.contains('active');
      item.parentElement.querySelectorAll('.faq-item.active').forEach(function(open){
        if(open!==item){ open.classList.remove('active'); open.querySelector('.faq-question').setAttribute('aria-expanded','false'); }
      });
      item.classList.toggle('active', !isActive);
      btn.setAttribute('aria-expanded', String(!isActive));
    });
  });
});
