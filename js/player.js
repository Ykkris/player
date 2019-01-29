const listesMorceaux =[
  'Musiques/Balma.mp3',
  'Musiques/F-U-Y-A.mp3',
  'Musiques/Chinese Man - Dont Scream Smokey Joe The Kid Remix Official Video.mp3',
];
//Click sur le bouton random et coeur
$('.coeur').click(function(){
  $(this).toggleClass('cliquer');
});

$('.random').click(function(){
  $(this).toggleClass('cliquer');
});

//On s'occupe du bouton play
$('.play').click(function(){
  console.log("Dans le play : " + tpsPause);
  console.log("Duration :" + (Math.trunc(loadedSources[numTitre].duration/60)) + ":" + (Math.trunc(loadedSources[numTitre].duration%60)));
  play(numTitre);
  $('.play').hide();
  $('.pause').show();
});

//Et le bouton pause
$('.pause').click(function(){
  tpsPause = context.currentTime - tpsStart;
  clearInterval(timeInterval);
  console.log("Dans le pause : " + tpsPause);
  source.stop();
  $('.play').show();
  $('.pause').hide();
});

// Bouton Suivant
$('.suiv').click(function(){

  if (source){
    source.stop();
  }
  if(numTitre+1 == nbTitre)
  {
    numTitre = 0;
  } else {
    numTitre ++;
  }
  console.log("numTitre: " + numTitre);
  console.log("nbTitre " + nbTitre);
  tpsPause = 0;
  initTimeSong();
  loadFile();
  play(numTitre);
  $('.play').hide();
  $('.pause').show();
});

// Bouton précédent
$('.prec').click(function(){
  tpsPause = context.currentTime - tpsStart;
  console.log("Précédent : " + tpsPause);
  if(source) {
      source.stop();
  }

  if(tpsPause < 5){
    if(numTitre == 0) {
        numTitre = nbTitre-1;
      } else {
        numTitre --;
      }
  }
  tpsPause = 0;
  loadFile();
  initTimeSong();
  play(numTitre);
  $('.play').hide();
  $('.pause').show();
});

// Gestion de la barre de progression
$('.progress-bar').click(function(param){
  console.log("coordonné X = " + param.offsetX);
  console.log("Client width = " , $('.progress-bar')[0].clientWidth);
  if(source){
    source.stop();
  }
  tpsPause = (param.offsetX*loadedSources[numTitre].duration)/$('.progress-bar')[0].clientWidth;
  secondeEnCours = Math.trunc(tpsPause%60);
  minuteEnCours = Math.trunc(tpsPause/60);
  clearInterval(timeInterval);
  play(numTitre);
});

// Lecture du son
function play(num) {
  var offset = tpsPause;

  source = context.createBufferSource();
  source.buffer = loadedSources[num];
  source.connect(context.destination);
  console.log(loadedSources[numTitre].duration);
  strTpsTotal = (Math.trunc(loadedSources[numTitre].duration/60)) + ":" + (Math.trunc(loadedSources[numTitre].duration%60));

  $(".temps--actuel").html("0:00");
  $(".temps--total").html(strTpsTotal);

  timeInterval = setInterval(function(){
      secondeEnCours ++;
      if (secondeEnCours == 60) {
        minuteEnCours ++;
        secondeEnCours = 0;
      }
      // actualise la barre de progression
      let remplisBar = ((minuteEnCours*60+secondeEnCours)*100)/loadedSources[numTitre].duration;
      $(".remplis").css("width", remplisBar+'%');
      // temps actuel
      strTpsActuel = minuteEnCours + ":" + secondeEnCours;
      $(".temps--actuel").html(strTpsActuel);
  },1000);


  source.start(0, offset);

  tpsStart = context.currentTime - offset;
  tpsPause = 0;
}

function initTimeSong(){
  minuteEnCours = 0;
  secondeEnCours = 0;
  clearInterval(timeInterval);
}

//Montre les infos
/*$('#lePlayer').hover(function(){
  $('.information').toggleClass('monte');
});*/

var context;
var bufferLoader;
var source;
var loadedSource;
var tpsStart = 0;
var tpsPause = 0;

var minuteEnCours = 0;
var secondeEnCours = 0;
var timeInterval;

window.onload = init;


//Configuration du lecteur
var numTitre = 0;
var nbTitre = 0;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    listesMorceaux,
    finishedLoading
    );

  bufferLoader.load();
}

function loadFile() {
  console.log("On est dans file");
  var url = listesMorceaux[numTitre];
  console.log(url);

  ID3.loadTags(url, function() {
    showTags(url);
  }, {
    tags: ["title","artist","album","picture"]
  });
}

function showTags(url) {
  var tags = ID3.getAllTags(url);
  console.log(tags);
  if(tags.title){
    document.querySelector('.titre-music').textContent = tags.title;
  } else {
    let regex = /^Musiques\/|.mp3$/gm;
    let nomMusique = url.replace(regex, '');
    console.log(nomMusique);
    $(".titre-music").html(nomMusique);
  }

  if(tags.artist) {
    document.querySelector('.artiste').textContent = tags.artist;
  } else {
    $(".artiste").html("Artist unknown");
  }

  var image = tags.picture;
  if (image) {
    var base64String = "";
    for (var i = 0; i < image.data.length; i++) {
        base64String += String.fromCharCode(image.data[i]);
    }
    var base64 = "data:" + image.format + ";base64," +
            window.btoa(base64String);
    document.querySelector('.album').style.backgroundImage = 'url("' + base64 + '")';
  } else {
    document.querySelector('.album').style.backgroundImage = "url(../images/no-cover.png)";
  }
}
function finishedLoading(bufferList) {
  loadedSources = bufferList;
  loadFile();
  nbTitre = bufferList.length;
}

$('.pause').hide(); //cache le bouton pause tant qu'il n'est pas pressé

/*
- Précédent (Si chanson a deja commencé, mettre au début, sinon numTitre-1) => OK
- Suivant (numTitre ++) => OK
- Progress bar (récup du temps total + temps en cours)
- Volume Up
- Volume Down
- Volume Mute
- random
- Repeat 1/all
- Config Info (titre, artiste, cover)

A la suite...
Playlist
Egaliseur
Bibliothèque
*/
