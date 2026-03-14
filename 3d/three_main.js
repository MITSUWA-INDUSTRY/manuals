// Three.js本体
import * as THREE from 'three'

// マウスで3Dを回転・ズームするためのコントロール
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// OBJ形式の3Dモデルを読み込むローダー
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'

// MTL形式（OBJの材質情報）を読み込むローダー
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'


// --------------------------------------------
// HTML側からOBJ/MTLファイル名を取得
// <body data-obj="xxx.obj" data-mtl="xxx.mtl">
// のように指定しておく想定
// --------------------------------------------
const objFile = document.body.dataset.obj
const mtlFile = document.body.dataset.mtl


// --------------------------------------------
// シーン作成（3D空間の土台）
// --------------------------------------------
const scene = new THREE.Scene()

// 背景色
scene.background = new THREE.Color(0xf0f0f0)


// --------------------------------------------
// カメラ作成
// PerspectiveCamera = 人間の視点に近いカメラ
// --------------------------------------------
const camera = new THREE.PerspectiveCamera(
  60,                               // 視野角
  window.innerWidth / window.innerHeight, // 画面の縦横比
  0.1,                              // 最短描画距離
  5000                              // 最長描画距離
)

// カメラの初期位置
camera.position.set(100, 100, 100)


// --------------------------------------------
// レンダラー作成（3Dを画面に描画するエンジン）
// --------------------------------------------
const renderer = new THREE.WebGLRenderer({
  antialias: true  // ギザギザを軽減
})

// 描画サイズを画面サイズに設定
renderer.setSize(window.innerWidth, window.innerHeight)

// HTMLにcanvasを追加
document.body.appendChild(renderer.domElement)


// --------------------------------------------
// マウス操作コントローラ
// --------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement)

// 慣性付きのスムーズな回転
controls.enableDamping = true


// --------------------------------------------
// ライト（光源）
// 3Dモデルはライトがないと真っ黒になります
// --------------------------------------------

// 環境光に近いライト
scene.add(new THREE.HemisphereLight(0xffffff, 0x888888, 1.2))

// 太陽のような平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(100, 100, 100)
scene.add(light)


// --------------------------------------------
// MTLファイル読み込み（材質・色・テクスチャ）
// --------------------------------------------
const mtlLoader = new MTLLoader()

// 非同期でMTLファイルをロード
const materials = await mtlLoader.loadAsync(mtlFile)

// 材質を有効化
materials.preload()


// --------------------------------------------
// OBJファイル読み込み（3D形状）
// --------------------------------------------
const objLoader = new OBJLoader()

// 読み込んだ材質をOBJローダーに設定
objLoader.setMaterials(materials)

// OBJモデル読み込み
const object = await objLoader.loadAsync(objFile)

// シーンに追加
scene.add(object)


// --------------------------------------------
// 描画ループ
// requestAnimationFrameで毎フレーム描画
// --------------------------------------------
function animate() {

  // 次フレーム呼び出し
  requestAnimationFrame(animate)

  // カメラ操作更新（OrbitControls用）
  controls.update()

  // シーンを描画
  renderer.render(scene, camera)
}

// アニメーション開始
animate()


// --------------------------------------------
// ウィンドウサイズ変更時の処理
// --------------------------------------------
window.addEventListener('resize', () => {

  // カメラの縦横比を更新
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  // レンダラーサイズ変更
  renderer.setSize(window.innerWidth, window.innerHeight)
})
