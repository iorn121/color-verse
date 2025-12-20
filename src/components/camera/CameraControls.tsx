type CameraControlsProps = {
  active: boolean;
  canLock: boolean;
  onStart: () => void;
  onStop: () => void;
  onLock: () => void;
};

export default function CameraControls({
  active,
  canLock,
  onStart,
  onStop,
  onLock,
}: CameraControlsProps) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {!active ? (
        <button className="btn btn-primary" onClick={onStart}>
          カメラ開始
        </button>
      ) : (
        <>
          <button className="btn btn-primary" onClick={onLock} disabled={!canLock}>
            決定（この色にする）
          </button>
          <button className="btn" onClick={onStop}>
            停止
          </button>
        </>
      )}
    </div>
  );
}
