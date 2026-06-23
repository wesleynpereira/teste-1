
function toggleMenu(){
  const nav=document.getElementById('navLinks');
  if(nav) nav.classList.toggle('active');
}
document.addEventListener('click', function(e){
  if(e.target.matches('.nav-links a')){
    const nav=document.getElementById('navLinks');
    if(nav) nav.classList.remove('active');
  }
});
function slidePortfolio(direction){
  const track=document.getElementById('portfolioTrack');
  if(!track) return;
  const first=track.querySelector('.portfolio-item');
  const gap=22;
  const amount=first ? first.getBoundingClientRect().width + gap : Math.round(track.clientWidth * 0.85);
  track.scrollBy({left: direction * amount, behavior:'smooth'});
}

document.addEventListener('DOMContentLoaded', function(){
  const targets=document.querySelectorAll(
    '.section-head, .service-row, .portfolio-item, .about-grid > *, .step, .county-box, .cta-box, .contact-card, form:not(.quote-form)'
  );
  targets.forEach(el=>el.classList.add('reveal'));

  document.querySelectorAll('.service-menu-grid, .process-grid, .cities-list').forEach(el=>el.classList.add('reveal-group'));

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
});
