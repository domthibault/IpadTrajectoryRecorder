// TrajectoryRecorder.js — outil iPad pour dessiner et exporter des trajectoires en JSON

let points = [];
let recording = false;
let exportButton;
let resetButton;
let saveCount = 1; // compteur pour les noms de fichiers

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  stroke(0);
  strokeWeight(3);
  noFill();

  // Charger la dernière valeur sauvegardée de saveCount
  saveCount = parseInt(localStorage.getItem("trajectorySaveCount") || "1");

  exportButton = createButton("Exporter JSON");
  exportButton.position(10, 10);
  exportButton.mousePressed(exportTrajectory);

  resetButton = createButton("Réinitialiser");
  resetButton.position(130, 10);
  resetButton.mousePressed(resetTrajectory);
}

function draw() {
  background(255);

  // Afficher la trajectoire en cours
  if (points.length > 1) {
    for (let i = 0; i < points.length - 1; i++) {
      let p1 = points[i];
      let p2 = points[i + 1];
      line(p1.x * width, p1.y * height, p2.x * width, p2.y * height);
    }
  }
}

function touchStarted() {
  points = [];
  recording = true;
  addPoint(touches[0]);
  return false;
}

function touchMoved() {
  if (recording) {
    addPoint(touches[0]);
  }
  return false;
}

function touchEnded() {
  recording = false;
  return false;
}

function addPoint(touch) {
  let normX = constrain(touch.x / width, 0, 1);
  let normY = constrain(touch.y / height, 0, 1);
  points.push({ x: normX, y: normY });
}

function exportTrajectory() {
  // Effacer message précédent
  let oldMsg = document.getElementById("export-confirmation");
  if (oldMsg) oldMsg.remove();
  if (points.length < 2) {
    alert("Aucune trajectoire à exporter.");
    return;
  }
  let jsonString = JSON.stringify(points, null, 2);
  let blob = new Blob([jsonString], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let filename = `trajectory_${saveCount.toString().padStart(3, '0')}.json`;

  // Mettre à jour et sauvegarder le compteur dans localStorage
  saveCount++;
  localStorage.setItem("trajectorySaveCount", saveCount);

  // Créer dynamiquement un lien pour déclencher le téléchargement (compatible iPad Safari)
  let a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Afficher un message de confirmation
  let msg = document.createElement("div");
  msg.id = "export-confirmation";
  msg.innerText = `✓ ${filename} téléchargé`;
  msg.style.position = "absolute";
  msg.style.top = "50px";
  msg.style.left = "10px";
  msg.style.background = "#333";
  msg.style.color = "#fff";
  msg.style.padding = "8px 12px";
  msg.style.borderRadius = "5px";
  msg.style.fontSize = "14px";
  msg.style.zIndex = "1000";
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 3000);
}

function resetTrajectory() {
  points = [];
  background(255);
} 
