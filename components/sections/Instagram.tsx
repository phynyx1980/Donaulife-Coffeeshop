"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Play, Images, ExternalLink } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Modal from "@/components/ui/Modal";
import { useLanguage } from "@/lib/i18n";
import type { InstagramPost } from "@/lib/types";

const PROFILES = [
  {
    handle: "@donaulifecoffeeshop",
    label: "Coffeeshop",
    followers: "1.113",
    posts: "182",
    link: "https://www.instagram.com/donaulifecoffeeshop/",
  },
  {
    handle: "@donaulife",
    label: "Headshop",
    followers: "4.158",
    posts: "807",
    link: "https://www.instagram.com/donaulife/",
  },
];

const GRADIENT_PLACEHOLDERS = [
  "linear-gradient(135deg,#0a4a1a,#1a8a3a)",
  "linear-gradient(135deg,#0a2a4a,#1a5a7a)",
  "linear-gradient(135deg,#2a0a4a,#5a1a8a)",
  "linear-gradient(135deg,#4a2a0a,#8a5a1a)",
  "linear-gradient(135deg,#0a3a3a,#1a7a5a)",
  "linear-gradient(135deg,#3a0a0a,#7a1a1a)",
  "linear-gradient(135deg,#1a2a0a,#3a5a1a)",
  "linear-gradient(135deg,#0a1a3a,#1a3a6a)",
  "linear-gradient(135deg,#2a1a0a,#5a3a1a)",
];

function PostSkeleton() {
  return <div className="skeleton" style={{ aspectRatio: "1", borderRadius: "8px" }} />;
}

export default function Instagram() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data: InstagramPost[]) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const followLabel = t("ig_follow");
  const postsLabel = t("ig_posts");
  const followersLabel = t("ig_followers");

  return (
    <section
      id="instagram"
      style={{
        background: "var(--bg2)",
        padding: "100px 24px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHead
          pre={t("ig_pre")}
          title={t("ig_title")}
          sub={t("ig_sub")}
        />

        {/* Profile Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "20px",
            marginBottom: "48px",
          }}
        >
          {PROFILES.map((profile) => (
            <motion.div
              key={profile.handle}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "18px",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* Avatar with IG Gradient Ring */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  padding: "2px",
                  background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "var(--card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                  }}
                >
                  🌿
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "var(--tx)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile.handle}
                </div>
                <div style={{ color: "var(--tx2)", fontSize: "12px", marginBottom: "8px" }}>
                  {profile.label}
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ color: "var(--tx2)", fontSize: "12px" }}>
                    <strong style={{ color: "var(--tx)" }}>{profile.followers}</strong> {followersLabel}
                  </span>
                  <span style={{ color: "var(--tx2)", fontSize: "12px" }}>
                    <strong style={{ color: "var(--tx)" }}>{profile.posts}</strong> {postsLabel}
                  </span>
                </div>
              </div>

              {/* Follow Button */}
              <a
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "var(--green)",
                  color: "#080808",
                  border: "none",
                  borderRadius: "50px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-syne)",
                }}
              >
                {followLabel}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Post Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "8px",
          }}
        >
          {loading
            ? [0,1,2,3,4,5,6,7,8].map((i) => <PostSkeleton key={i} />)
            : posts.slice(0, 9).map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedPost(post)}
                style={{
                  aspectRatio: "1",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  background: GRADIENT_PLACEHOLDERS[idx % GRADIENT_PLACEHOLDERS.length],
                }}
              >
                {post.media_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.media_type === "VIDEO" ? (post.thumbnail_url ?? post.media_url) : post.media_url}
                    alt={post.caption.slice(0, 40)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                    }}
                  >
                    🌿
                  </div>
                )}

                {/* Hover overlay */}
                <div
                  className="post-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
                >
                  <Heart size={18} color="#fff" fill="#fff" />
                  <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
                    {post.like_count}
                  </span>
                </div>

                {/* Type Badge */}
                {post.media_type === "VIDEO" && (
                  <div style={{ position: "absolute", top: "6px", right: "6px" }}>
                    <Play size={14} color="#fff" fill="#fff" />
                  </div>
                )}
                {post.media_type === "CAROUSEL_ALBUM" && (
                  <div style={{ position: "absolute", top: "6px", right: "6px" }}>
                    <Images size={14} color="#fff" />
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </div>

      {/* Post Modal */}
      <Modal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)}>
        {selectedPost && (
          <div>
            {selectedPost.media_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedPost.media_type === "VIDEO" ? (selectedPost.thumbnail_url ?? selectedPost.media_url) : selectedPost.media_url}
                alt=""
                style={{ width: "100%", borderRadius: "18px 18px 0 0", objectFit: "cover", maxHeight: "400px" }}
              />
            ) : (
              <div
                style={{
                  height: "300px",
                  background: GRADIENT_PLACEHOLDERS[0],
                  borderRadius: "18px 18px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}
              >
                🌿
              </div>
            )}
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Heart size={16} color="var(--green)" fill="var(--green)" />
                <span style={{ color: "var(--tx2)", fontSize: "14px" }}>{selectedPost.like_count} Likes</span>
              </div>
              <p style={{ color: "var(--tx2)", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>
                {selectedPost.caption}
              </p>
              <a
                href={selectedPost.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--green)",
                  fontSize: "14px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Auf Instagram ansehen <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
