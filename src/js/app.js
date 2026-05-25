// ================================================================
    // CUBO MÁGICO 3D
    // Baseado nos exemplos da aula:
    // - Scene, Camera e Renderer
    // - THREE.Group para escopo de transformação
    // - requestAnimationFrame para animação suave
    // - OrbitControls para câmera orbital com mouse
    // ================================================================

    // -------------------- CENA, CÂMERA E RENDERER --------------------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5.4, 5.0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x070a12);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 5;
    controls.maxDistance = 18;
    controls.target.set(0, 0, 0);

    // Luz ambiente simples. Os adesivos usam MeshBasicMaterial,
    // então não escurecem nem ficam pretos ao rotacionar.
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // Grupo raiz: equivalente ao escopo global dos exemplos.
    const cubeRoot = new THREE.Group();
    scene.add(cubeRoot);

    // -------------------- ELEMENTOS DE INTERFACE --------------------
    const elMovimentos = document.getElementById('movimentos');
    const elEstado = document.getElementById('estado');
    const botoes = [...document.querySelectorAll('[data-move]')];
    const btnEmbaralhar = document.getElementById('embaralhar');
    const btnReiniciar = document.getElementById('reiniciar');
    const selectTema = document.getElementById('tema');

    // -------------------- CONFIGURAÇÕES DO CUBO --------------------
    const CUBIE_SIZE = 0.94;
    const GAP = 0.08;
    const STEP = CUBIE_SIZE + GAP;
    const STICKER_SIZE = 0.68;
    const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.006;

    const temas = {
      classico: {
        U: 0xffffff, D: 0xffd500, F: 0x00a651,
        B: 0x0051ba, R: 0xc41e3a, L: 0xff7f00
      },
      neon: {
        U: 0xf8f8ff, D: 0xf9ff00, F: 0x00ff85,
        B: 0x00bbff, R: 0xff206e, L: 0xff9f1c
      },
      pastel: {
        U: 0xf8f7f2, D: 0xffec99, F: 0x95d5b2,
        B: 0x90dbf4, R: 0xffadad, L: 0xffc971
      }
    };

    let cubies = [];
    let movimentos = 0;
    let animando = false;
    let fila = [];
    let temaAtual = 'classico';
    let estadoResolvidoAnterior = true;

    const moveMap = {
      U:  { axis: 'y', layer:  1, dir: -1 },
      "U'": { axis: 'y', layer:  1, dir:  1 },
      D:  { axis: 'y', layer: -1, dir:  1 },
      "D'": { axis: 'y', layer: -1, dir: -1 },
      R:  { axis: 'x', layer:  1, dir: -1 },
      "R'": { axis: 'x', layer:  1, dir:  1 },
      L:  { axis: 'x', layer: -1, dir:  1 },
      "L'": { axis: 'x', layer: -1, dir: -1 },
      F:  { axis: 'z', layer:  1, dir: -1 },
      "F'": { axis: 'z', layer:  1, dir:  1 },
      B:  { axis: 'z', layer: -1, dir:  1 },
      "B'": { axis: 'z', layer: -1, dir: -1 }
    };

    const axisVector = {
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1)
    };

    // -------------------- CRIAÇÃO DO CUBO 3×3×3 --------------------
    function criarCubo() {
      while (cubeRoot.children.length) cubeRoot.remove(cubeRoot.children[0]);
      cubies = [];
      movimentos = 0;
      atualizarHUD();

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const cubie = criarCubinho(x, y, z);
            cubies.push(cubie);
            cubeRoot.add(cubie);
          }
        }
      }

      estadoResolvidoAnterior = true;
      atualizarVitoria();
    }

    function criarCubinho(x, y, z) {
      const cubie = new THREE.Group();
      cubie.position.set(x * STEP, y * STEP, z * STEP);
      cubie.userData.coord = new THREE.Vector3(x, y, z);
      cubie.userData.home = new THREE.Vector3(x, y, z);
      cubie.userData.stickers = [];

      const corpo = new THREE.Mesh(
        new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE),
        new THREE.MeshBasicMaterial({ color: 0x050505 })
      );
      cubie.add(corpo);

      // Arestas pretas para separar visualmente cada cubinho.
      const arestas = new THREE.LineSegments(
        new THREE.EdgesGeometry(corpo.geometry),
        new THREE.LineBasicMaterial({ color: 0x202020 })
      );
      cubie.add(arestas);

      if (x ===  1) adicionarAdesivo(cubie, 'R', new THREE.Vector3( STICKER_OFFSET, 0, 0), new THREE.Euler(0, Math.PI / 2, 0));
      if (x === -1) adicionarAdesivo(cubie, 'L', new THREE.Vector3(-STICKER_OFFSET, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0));
      if (y ===  1) adicionarAdesivo(cubie, 'U', new THREE.Vector3(0,  STICKER_OFFSET, 0), new THREE.Euler(-Math.PI / 2, 0, 0));
      if (y === -1) adicionarAdesivo(cubie, 'D', new THREE.Vector3(0, -STICKER_OFFSET, 0), new THREE.Euler( Math.PI / 2, 0, 0));
      if (z ===  1) adicionarAdesivo(cubie, 'F', new THREE.Vector3(0, 0,  STICKER_OFFSET), new THREE.Euler(0, 0, 0));
      if (z === -1) adicionarAdesivo(cubie, 'B', new THREE.Vector3(0, 0, -STICKER_OFFSET), new THREE.Euler(0, Math.PI, 0));

      return cubie;
    }

    function adicionarAdesivo(cubie, face, position, rotation) {
      const mat = new THREE.MeshBasicMaterial({
        color: temas[temaAtual][face],
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      });

      const sticker = new THREE.Mesh(
        new THREE.PlaneGeometry(STICKER_SIZE, STICKER_SIZE),
        mat
      );
      sticker.position.copy(position);
      sticker.rotation.copy(rotation);
      sticker.userData.face = face;
      cubie.userData.stickers.push(sticker);
      cubie.add(sticker);
    }

    // -------------------- ROTAÇÃO DAS FACES --------------------
    function pedirMovimento(nomeMovimento, contar = true) {
      const config = moveMap[nomeMovimento];
      if (!config) return;
      fila.push({ nome: nomeMovimento, ...config, contar });
      processarFila();
    }

    function processarFila() {
      if (animando || fila.length === 0) return;
      const movimento = fila.shift();
      girarFace(movimento);
    }

    function girarFace({ axis, layer, dir, contar }) {
      animando = true;
      setBotoesAtivos(false);
      elEstado.textContent = 'Girando...';
      elEstado.style.color = '#ffdd55';

      const selecionados = cubies.filter(c => Math.round(c.userData.coord[axis]) === layer);
      const grupoFace = new THREE.Group();
      cubeRoot.add(grupoFace);

      // THREE.Group por face: os cubinhos da camada entram temporariamente no grupo,
      // a rotação é animada nele, e ao final eles voltam ao cubeRoot.
      selecionados.forEach(cubie => grupoFace.attach(cubie));

      const anguloFinal = dir * Math.PI / 2;
      const duracao = 260;
      const inicio = performance.now();

      function animar(agora) {
        const t = Math.min((agora - inicio) / duracao, 1);
        const suave = 1 - Math.pow(1 - t, 3); // easeOutCubic
        grupoFace.rotation[axis] = anguloFinal * suave;

        if (t < 1) {
          requestAnimationFrame(animar);
        } else {
          grupoFace.rotation[axis] = anguloFinal;
          selecionados.forEach(cubie => cubeRoot.attach(cubie));
          cubeRoot.remove(grupoFace);

          atualizarCoordenadas(selecionados, axis, dir);
          corrigirTransformacoes(selecionados);

          if (contar) movimentos++;
          atualizarHUD();

          animando = false;
          setBotoesAtivos(true);
          atualizarVitoria();
          processarFila();
        }
      }

      requestAnimationFrame(animar);
    }

    function atualizarCoordenadas(selecionados, axis, dir) {
      const matriz = new THREE.Matrix4().makeRotationAxis(axisVector[axis], dir * Math.PI / 2);
      selecionados.forEach(cubie => {
        const coord = cubie.userData.coord.clone().applyMatrix4(matriz);
        cubie.userData.coord.set(
          Math.round(coord.x),
          Math.round(coord.y),
          Math.round(coord.z)
        );
        cubie.position.set(
          cubie.userData.coord.x * STEP,
          cubie.userData.coord.y * STEP,
          cubie.userData.coord.z * STEP
        );
      });
    }

    function corrigirTransformacoes(selecionados) {
      selecionados.forEach(cubie => {
        // Evita pequenas sobras numéricas depois de várias rotações.
        cubie.position.x = Math.round(cubie.position.x / STEP) * STEP;
        cubie.position.y = Math.round(cubie.position.y / STEP) * STEP;
        cubie.position.z = Math.round(cubie.position.z / STEP) * STEP;

        const e = new THREE.Euler().setFromQuaternion(cubie.quaternion, 'XYZ');
        e.x = arredondarAngulo90(e.x);
        e.y = arredondarAngulo90(e.y);
        e.z = arredondarAngulo90(e.z);
        cubie.quaternion.setFromEuler(e);
      });
    }

    function arredondarAngulo90(angulo) {
      const passo = Math.PI / 2;
      return Math.round(angulo / passo) * passo;
    }

    // -------------------- EMBARALHAR, REINICIAR, VITÓRIA --------------------
    function embaralhar() {
      if (animando) return;
      const nomes = Object.keys(moveMap);
      const quantidade = 24;
      for (let i = 0; i < quantidade; i++) {
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        pedirMovimento(nome, true);
      }
    }

    function estaResolvido() {
      return cubies.every(cubie => {
        const atual = cubie.userData.coord;
        const home = cubie.userData.home;
        const posicaoOk = atual.x === home.x && atual.y === home.y && atual.z === home.z;
        const orientacaoOk = Math.abs(cubie.quaternion.x) < 0.0001 &&
                            Math.abs(cubie.quaternion.y) < 0.0001 &&
                            Math.abs(cubie.quaternion.z) < 0.0001;
        return posicaoOk && orientacaoOk;
      });
    }

    function atualizarVitoria() {
      const resolvido = estaResolvido();
      if (resolvido) {
        elEstado.textContent = 'Resolvido';
        elEstado.style.color = '#8cffb5';
      } else {
        elEstado.textContent = 'Em jogo';
        elEstado.style.color = '#ffdd55';
      }

      if (resolvido && !estadoResolvidoAnterior && movimentos > 0) {
        elEstado.textContent = 'Vitória!';
        elEstado.style.color = '#8cffb5';
      }
      estadoResolvidoAnterior = resolvido;
    }

    function atualizarHUD() {
      elMovimentos.textContent = movimentos;
    }

    function setBotoesAtivos(ativo) {
      [...botoes, btnEmbaralhar, btnReiniciar, selectTema].forEach(el => {
        el.disabled = !ativo;
      });
    }

    function aplicarTema(nomeTema) {
      temaAtual = nomeTema;
      cubies.forEach(cubie => {
        cubie.userData.stickers.forEach(sticker => {
          sticker.material.color.setHex(temas[temaAtual][sticker.userData.face]);
        });
      });
    }

    // -------------------- EVENTOS --------------------
    botoes.forEach(btn => {
      btn.addEventListener('click', () => pedirMovimento(btn.dataset.move, true));
    });

    btnEmbaralhar.addEventListener('click', embaralhar);

    btnReiniciar.addEventListener('click', () => {
      if (animando) return;
      fila = [];
      criarCubo();
    });

    selectTema.addEventListener('change', (e) => aplicarTema(e.target.value));

    document.addEventListener('keydown', (e) => {
      const tecla = e.key.toUpperCase();

      // Atalhos principais mais convencionais:
      // Q/W = face superior, A/S = face frontal, Z/X = face direita.
      // R = reset, E = embaralhar.
      const atalhos = {
        Q: 'U',
        W: "U'",
        A: 'F',
        S: "F'",
        Z: 'R',
        X: "R'"
      };

      if (tecla === 'R') {
        if (!animando) {
          fila = [];
          criarCubo();
        }
        return;
      }

      if (tecla === 'E') {
        embaralhar();
        return;
      }

      if (atalhos[tecla]) {
        pedirMovimento(atalhos[tecla], true);
      }
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // -------------------- DECORAÇÃO DA CENA --------------------
    const grade = new THREE.GridHelper(8, 8, 0x334466, 0x182033);
    grade.position.y = -2.15;
    scene.add(grade);

    const estrelaGeo = new THREE.BufferGeometry();
    const estrelas = [];
    for (let i = 0; i < 600; i++) {
      estrelas.push(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120
      );
    }
    estrelaGeo.setAttribute('position', new THREE.Float32BufferAttribute(estrelas, 3));
    scene.add(new THREE.Points(
      estrelaGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 })
    ));

    // -------------------- LOOP PRINCIPAL --------------------
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      cubeRoot.rotation.y += 0.0015;
      renderer.render(scene, camera);
    }

    criarCubo();
    animate();
