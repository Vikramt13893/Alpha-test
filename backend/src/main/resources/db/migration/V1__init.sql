CREATE TABLE video (
    id UUID PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    view_count BIGINT NOT NULL DEFAULT 0,
    duration_seconds INT NOT NULL CHECK (duration_seconds >= 1),
    category VARCHAR(128),
    s3_object_key VARCHAR(1024) NOT NULL
);

CREATE INDEX idx_video_view_count ON video (view_count DESC);
