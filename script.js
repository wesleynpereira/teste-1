
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
