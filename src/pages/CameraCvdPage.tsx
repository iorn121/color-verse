import Webcam from 'react-webcam';

import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';
import { CvdType, useCameraCvd } from '../hooks/useCameraCvd';

export default function CameraCvdPage() {
  const { webcamRef, canvasRef, state, setCvd, start, stop, setError } = useCameraCvd();
  const { active, error, cvd } = state;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title="色覚シミュレーション" />
      <Description>カメラ映像を色覚特性ごとに擬似的に変換して表示します。</Description>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {!active ? (
          <button className="btn btn-primary" onClick={start}>
            カメラ開始
          </button>
        ) : (
          <button className="btn" onClick={stop}>
            停止
          </button>
        )}
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <select
            value={cvd}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCvd(e.target.value as CvdType)
            }
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'white',
            }}
          >
            <option value="common">C型（一般色覚）</option>
            <option value="deuteranopia">D型（Deuteranopia）</option>
            <option value="protanopia">P型（Protanopia）</option>
            <option value="tritanopia">T型（Tritanopia）</option>
          </select>
        </label>
      </div>

      {error && (
        <div className="card" style={{ borderColor: '#fca5a5', color: '#b91c1c' }}>
          カメラエラー: {error}
        </div>
      )}

      <div style={{ position: 'relative', width: '100%', maxWidth: 640 }}>
        {active && (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            forceScreenshotSourceSize
            onUserMedia={() => setError(null)}
            onUserMediaError={(e) => setError((e as Error).message ?? 'camera error')}
            style={{
              width: '100%',
              borderRadius: 8,
              background: '#000',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              visibility: 'hidden', // hidden video; canvas shows processed image
              position: 'absolute',
              inset: 0,
            }}
            videoConstraints={{
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }}
          />
        )}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            maxWidth: 640,
            borderRadius: 8,
            background: '#000',
            aspectRatio: '16 / 9',
          }}
        />
      </div>

      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <div style={{ fontWeight: 700 }}>シミュレーション対象の色覚タイプ</div>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          人は桿体で明暗、錐体で色の感覚を認識します。
          錐体にはL（長波長=赤）、M（中波長=緑）、S（短波長=青）の3種類があります。
        </p>
        <ul style={{ display: 'grid', gap: 4, margin: 0, paddingLeft: 16 }}>
          <li>
            <strong>C型（一般色覚）</strong>: 3種類の錐体が一般的に機能する状態。
          </li>
          <li>
            <strong>P型（Protanopia, 1型2色覚）</strong>:
            L錐体（赤）機能がない。赤やオレンジが暗く見え、赤緑の区別が困難。
          </li>
          <li>
            <strong>D型（Deuteranopia, 2型2色覚）</strong>:
            M錐体（緑）機能がない。赤の明るさは保たれるが、赤緑の区別が困難。
          </li>
          <li>
            <strong>T型（Tritanopia, 3型2色覚）</strong>:
            S錐体（青）機能がない。青と緑、黄色と紫の区別が困難。
          </li>
          <li>
            <strong>A型（Achromatopsia, 全色覚異常）</strong>:
            錐体が機能せず桿体主体。色の区別ができずモノクロに近い。
          </li>
        </ul>
        <small style={{ color: 'var(--color-text-tertiary)' }}>
          本シミュレーターで切替可能なタイプ: C型 / P型 / D型 / T型。
        </small>
      </div>

      <HomeLink fixed />
    </div>
  );
}
