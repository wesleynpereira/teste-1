
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
