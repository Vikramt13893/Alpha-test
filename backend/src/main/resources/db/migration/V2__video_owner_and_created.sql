ALTER TABLE video
    ADD COLUMN uploaded_by VARCHAR(64) NOT NULL DEFAULT 'unknown',
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX idx_video_uploaded_by ON video (uploaded_by);
CREATE INDEX idx_video_created_at ON video (created_at DESC);
