import React, { useEffect, useState } from "react";
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from "react-router-dom";
import { useSiteContext } from "../../contexts/SiteContext";
import Modal from "../../components/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { useUserName } from "../../hooks/useUserName";

type Comment = { id: string; user: string; text: string; createdAt: number; };
type CollabRequest = { id: string; user: string; message: string; createdAt: number; status: "pending" | "accepted" | "rejected"; };
type Version = { version: number; editor: string; date: number; title: string; topic: string; body: string; };
type Thread = {
  id: string; title: string; topic: string; author: string; body: string;
  createdAt: number; updatedAt: number; version: number; versions: Version[];
  likes: number; comments: Comment[]; collabRequests: CollabRequest[]; canEdit: string[];
};

const COLLAB_KEY = "auralis-collab-threads-v4";

const content = {
  EN: {
    currentUserLabel: "Current User Name:",
    desc: "Share motifs, harmony ideas, and structure maps — build music together.",
    titlePlaceholder: "Thread title (e.g., Dawn motif reharm)",
    topicPlaceholder: "Topic / tag (e.g., C Lydian, 6/8, warm)",
    bodyPlaceholder: "Share your idea (motif / chords / structure...)",
    authorPlaceholder: "Your name (Guest)",
    postButton: "Post Thread",
    empty: "No collab threads yet — create the first one.",
    delete: "Delete",
    edit: "Edit",
    collaborate: "Collaborate",
    comment: "Comment",
    comments: "Comments",
    collabRequests: "Collab Requests",
    postComment: "Post Comment",
    sendRequest: "Send Request",
    noComments: "No comments yet.",
    editThreadTitle: "Edit Thread",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    accept: "Accept",
    reject: "Reject",
    status: { pending: "Pending", accepted: "Accepted", rejected: "Rejected" },
    history: "History",
    versionHistory: "Version History",
    updated: "Updated",
  },
  KR: {
    currentUserLabel: "현재 사용자 이름:",
    desc: "모티브, 화성 아이디어, 구조 맵을 공유하며 함께 음악을 만들어가세요.",
    titlePlaceholder: "스레드 제목 (예: 새벽 모티브 리하모니)",
    topicPlaceholder: "주제 / 태그 (예: C 리디안, 6/8, 따뜻함)",
    bodyPlaceholder: "아이디어를 공유하세요 (모티브 / 코드/ 구조...)",
    authorPlaceholder: "이름 (Guest)",
    postButton: "스레드 게시",
    empty: "아직 협업 스레드가 없습니다 — 첫 스레드를 만들어보세요.",
    delete: "삭제",
    edit: "수정",
    collaborate: "협업하기",
    comment: "댓글",
    comments: "댓글",
    collabRequests: "협업 요청",
    postComment: "댓글 달기",
    sendRequest: "요청 보내기",
    noComments: "아직 댓글이 없습니다.",
    editThreadTitle: "스레드 수정",
    saveChanges: "변경사항 저장",
    cancel: "취소",
    accept: "수락",
    reject: "거절",
    status: { pending: "대기 중", accepted: "수락됨", rejected: "거절됨" },
    history: "히스토리",
    versionHistory: "버전 히스토리",
    updated: "업데이트됨",
  }
};

const formatDate = (ts: number, locale: string) =>
  new Date(ts).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });

const ThreadItem: React.FC<{
  thread: Thread;
  currentUser: string;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onCollabRequest: (id: string, message: string) => void;
  onUpdateRequestStatus: (threadId: string, requestId: string, status: 'accepted' | 'rejected') => void;
  onUpdateThread: (threadId: string, updates: Partial<Thread>) => void;
  language: 'EN' | 'KR';
}> = ({
  thread, currentUser, onDelete, onLike, onComment, onCollabRequest, onUpdateRequestStatus, onUpdateThread, language
}) => {
  const c = content[language];
  const [showComments, setShowComments] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: thread.title, topic: thread.topic, body: thread.body });
  const [newComment, setNewComment] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [isLiked, setIsLiked] = useState(() => localStorage.getItem(`liked_${thread.id}`) === 'true');

  const isAuthor = thread.author === currentUser;
  const canEditContent = thread.canEdit.includes(currentUser) || isAuthor;

  const handleLikeClick = () => {
    if (!isLiked) {
      onLike(thread.id);
      setIsLiked(true);
      localStorage.setItem(`liked_${thread.id}`, 'true');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onComment(thread.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleSendRequest = () => {
    if (requestMsg.trim()) {
      onCollabRequest(thread.id, requestMsg.trim());
      setShowCollabModal(false);
      setRequestMsg("");
    }
  };

  const startEditing = () => {
    setEditForm({ title: thread.title, topic: thread.topic, body: thread.body });
    setEditing(true);
  };
  const handleCancelEdit = () => setEditing(false);

  const handleSaveChanges = () => {
    const now = Date.now();
    const nextVersionNumber = (thread.version || 1) + 1;

    const newTitle = isAuthor ? editForm.title : thread.title;
    const newTopic = isAuthor ? editForm.topic : thread.topic;
    const newBody = editForm.body;

    const newVersion: Version = {
      version: nextVersionNumber, editor: currentUser, date: now,
      title: newTitle, topic: newTopic, body: newBody,
    };

    const versions = thread.versions || [{
      version: 1, editor: thread.author, date: thread.createdAt,
      title: thread.title, topic: thread.topic, body: thread.body
    }];

    const updates = {
      title: newTitle, topic: newTopic, body: newBody,
      updatedAt: now, version: nextVersionNumber, versions: [...versions, newVersion],
    };

    onUpdateThread(thread.id, updates);
    setEditing(false);
  };

  const getStatusChip = (status: CollabRequest['status']) => {
    const styles = {
      pending: "bg-yellow-200/60 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200",
      accepted: "bg-green-200/60 text-green-900 dark:bg-green-500/20 dark:text-green-200",
      rejected: "bg-red-200/60 text-red-900 dark:bg-red-500/20 dark:text-red-200",
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{c.status[status]}</span>;
  };

  return (
    <motion.li
      layout
      className="collab-thread rounded-2xl border p-5 bg-[var(--card)] border-[var(--border)]
                 transition-shadow hover:shadow-md
                 text-neutral-800 dark:text-neutral-100"
    >
      {editing ? (
        <div>
          <input
            type="text"
            className={`w-full border p-2 mb-3 rounded-lg bg-transparent
                        border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none
                        text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500
                        ${!isAuthor ? "bg-gray-100 dark:bg-zinc-800/60 cursor-not-allowed" : ""}`}
            value={editForm.title}
            onChange={(e) => { if (isAuthor) setEditForm(f => ({...f, title: e.target.value})) }}
            readOnly={!isAuthor}
            aria-readonly={!isAuthor}
            placeholder="Title"
          />
          <input
            type="text"
            className={`w-full border p-2 mb-3 rounded-lg bg-transparent
                        border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none
                        text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500
                        ${!isAuthor ? "bg-gray-100 dark:bg-zinc-800/60 cursor-not-allowed" : ""}`}
            value={editForm.topic}
            onChange={(e) => { if (isAuthor) setEditForm(f => ({...f, topic: e.target.value})) }}
            readOnly={!isAuthor}
            aria-readonly={!isAuthor}
            placeholder="Topic"
          />
          <textarea
            className="w-full border p-3 rounded-lg h-36 bg-transparent
                       border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none
                       text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500"
            value={editForm.body}
            onChange={(e) => setEditForm(f => ({...f, body: e.target.value}))}
            placeholder="Body"
          />
          <div className="flex gap-2 mt-2">
            <button
              className="rounded-md px-3 py-1.5 bg-[#CBAE7A] text-white text-xs font-medium hover:opacity-90"
              onClick={handleSaveChanges}
            >
              {c.saveChanges}
            </button>
            <button
              className="rounded-md px-3 py-1.5 border border-[var(--border)]
                         hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors text-xs"
              onClick={handleCancelEdit}
            >
              {c.cancel}
            </button>
          </div>
          {!isAuthor && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
              {language === 'EN'
                ? `Title and topic can only be edited by the author (${thread.author}).`
                : `제목과 주제는 작성자(${thread.author})만 수정할 수 있습니다.`}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="title font-semibold text-lg flex items-center">
                <span>{thread.title}</span>
                {canEditContent && (
                  <button
                    onClick={startEditing}
                    className="ml-2 text-xs opacity-70 hover:opacity-100"
                    aria-label={c.edit}
                  >
                    ✏️
                  </button>
                )}
              </h3>
              <p className="post-meta text-xs text-zinc-600 dark:text-zinc-300">
                {thread.topic && (
                  <span className="px-2 py-0.5 rounded-full
                                   bg-amber-100 text-amber-800
                                   dark:bg-amber-400/15 dark:text-amber-200 mr-2">
                    {thread.topic}
                  </span>
                )}
                by <strong className="text-neutral-800 dark:text-neutral-100">{thread.author}</strong> on {formatDate(thread.createdAt, language === 'KR' ? 'ko-KR' : 'en-US')}
                <span className="mx-1">&bull;</span>
                {c.updated} {new Date(thread.updatedAt).toLocaleString(language === 'KR' ? 'ko-KR' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} (v{thread.version})
              </p>
            </div>
            <div>
              {isAuthor && (
                <button onClick={() => onDelete(thread.id)} className="text-xs text-neutral-500 hover:text-red-500">
                  {c.delete}
                </button>
              )}
            </div>
          </div>

          <p className="post-body mt-3 whitespace-pre-wrap text-sm leading-relaxed">
            {thread.body}
          </p>

          <div className="collab-actions flex items-center gap-4 mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700 text-sm">
            <button
              onClick={handleLikeClick}
              aria-pressed={isLiked}
              className={`flex items-center gap-1.5 transition-colors ${
                isLiked
                  ? 'text-red-500'
                  : 'text-zinc-700 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <span role="img" aria-label="like">❤️</span> {thread.likes}
            </button>
            <button
              onClick={() => setShowComments(s => !s)}
              className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
            >
              <span role="img" aria-label="comment">💬</span> {thread.comments.length}
            </button>
            <button
              onClick={() => setShowCollabModal(true)}
              className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200 hover:text-green-600 dark:hover:text-green-300 transition-colors"
            >
              <span role="img" aria-label="collaborate">🤝</span> {c.collaborate}
            </button>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            >
              <span role="img" aria-label="history">📜</span> {c.history} ({thread.version || 1})
            </button>
          </div>
        </>
      )}

      {isAuthor && thread.collabRequests.length > 0 && !editing && (
        <div className="mt-4 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-700">
          <h4 className="font-semibold text-sm mb-2 text-neutral-800 dark:text-neutral-100">{c.collabRequests}</h4>
          <div className="space-y-2">
            {thread.collabRequests.map(req => (
              <div
                key={req.id}
                className="p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/70 flex justify-between items-center text-sm
                           text-neutral-800 dark:text-neutral-100"
              >
                <div>
                  <span className="font-medium">{req.user}</span>:{' '}
                  <span className="text-zinc-700 dark:text-zinc-200 italic">"{req.message}"</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusChip(req.status)}
                  {req.status === 'pending' && (
                    <>
                      <button onClick={() => onUpdateRequestStatus(thread.id, req.id, 'accepted')} className="text-xs font-bold text-green-600 dark:text-green-300 hover:underline">{c.accept}</button>
                      <button onClick={() => onUpdateRequestStatus(thread.id, req.id, 'rejected')} className="text-xs font-bold text-red-600 dark:text-red-300 hover:underline">{c.reject}</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showComments && !editing && (
        <div className="mt-4 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-700">
          <h4 className="font-semibold text-sm mb-2 text-neutral-800 dark:text-neutral-100">{c.comments}</h4>
          {thread.comments.length > 0 ? (
            <div className="space-y-2 text-sm">
              {thread.comments.map(cmt => (
                <div key={cmt.id} className="p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 text-neutral-800 dark:text-neutral-100">
                  <span className="font-medium">{cmt.user}</span>: {cmt.text}
                </div>
              ))}
            </div>
          ) : (
            <p className="collab-hint text-xs text-zinc-600 dark:text-zinc-400 mt-2">{c.noComments}</p>
          )}
          <div className="mt-3">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="..."
              className="w-full border rounded-md p-2 text-sm bg-transparent
                         border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none
                         text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 rounded-md px-3 py-1.5 bg-[#CBAE7A] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50"
              disabled={!newComment.trim()}
            >
              {c.postComment}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCollabModal && (
          <Modal onClose={() => setShowCollabModal(false)}>
            <h4 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-neutral-100">{c.sendRequest}</h4>
            <textarea
              placeholder={language === 'KR' ? "간단한 메시지..." : "Brief message..."}
              value={requestMsg}
              onChange={e => setRequestMsg(e.target.value)}
              className="w-full border rounded-lg p-3 h-24 bg-transparent
                         border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none text-sm
                         text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500"
            />
            <button
              onClick={handleSendRequest}
              className="mt-4 w-full rounded-lg px-4 py-2 bg-[#CBAE7A] text-white hover:opacity-95 text-sm font-medium"
              disabled={!requestMsg.trim()}
            >
              {c.sendRequest}
            </button>
          </Modal>
        )}
        {showHistoryModal && (
          <Modal onClose={() => setShowHistoryModal(false)}>
            <h4 className="font-semibold text-lg mb-4 text-neutral-900 dark:text-neutral-100">{c.versionHistory}</h4>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
              {[...(thread.versions || [])].reverse().map(v => (
                <div key={v.version} className="p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-800
                                                text-neutral-800 dark:text-neutral-100">
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">
                    <strong>v{v.version}</strong> by {v.editor} on {new Date(v.date).toLocaleString(language === 'KR' ? 'ko-KR' : 'en-US')}
                  </p>
                  <p className="font-semibold mt-1">{v.title}</p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{v.body}</p>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

const CollabSection: React.FC = () => {
  const { language } = useSiteContext();
  const c = content[language as 'EN' | 'KR'];
  const [threads, setThreads] = useState<Thread[]>([]);
  const { userName: currentUser, setUserName: setCurrentUser } = useUserName();
  const [form, setForm] = useState<Partial<Omit<Thread, 'id' | 'createdAt' | 'author'>>>({});
  const [params] = ReactRouterDOM.useSearchParams();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COLLAB_KEY);
      if (raw) setThreads(JSON.parse(raw).sort((a: Thread, b: Thread) => b.createdAt - a.createdAt));
    } catch {}
  }, []);

  useEffect(() => {
    const title = params.get("title"), topic = params.get("topic"), body = params.get("body");
    if (title || topic || body) {
      setForm(f => ({
        ...f,
        title: title || f.title || "",
        topic: topic || f.topic || "",
        body: body || f.body || ""
      }));
    }
  }, [params]);

  const persist = (next: Thread[]) => {
    setThreads(next.sort((a,b) => b.createdAt - a.createdAt));
    try { localStorage.setItem(COLLAB_KEY, JSON.stringify(next)); } catch {}
  };

  const handleAddThread = () => {
    if (!form.title?.trim() || !form.body?.trim()) return;
    const author = currentUser.trim() || "Guest";
    const now = Date.now();
    const newThread: Thread = {
      id: crypto.randomUUID(),
      title: form.title!.trim(),
      topic: form.topic?.trim() || "",
      author,
      body: form.body!.trim(),
      createdAt: now,
      updatedAt: now,
      version: 1,
      versions: [{
        version: 1, editor: author, date: now,
        title: form.title!.trim(), topic: form.topic?.trim() || "", body: form.body!.trim(),
      }],
      likes: 0,
      comments: [],
      collabRequests: [],
      canEdit: [author],
    };
    persist([newThread, ...threads]);
    setForm({});
  };

  const handleRemoveThread = (id: string) => persist(threads.filter(t => t.id !== id));
  const handleLike = (id: string) => persist(threads.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  const handleAddComment = (id: string, text: string) =>
    persist(threads.map(t => t.id === id ? { ...t, comments: [...t.comments, { id: crypto.randomUUID(), user: currentUser, text, createdAt: Date.now() }] } : t));
  const handleAddCollabRequest = (id: string, message: string) =>
    persist(threads.map(t => t.id === id ? { ...t, collabRequests: [...t.collabRequests, { id: crypto.randomUUID(), user: currentUser, message, createdAt: Date.now(), status: 'pending' }] } : t));
  const handleUpdateThread = (id: string, updates: Partial<Thread>) =>
    persist(threads.map(t => t.id === id ? { ...t, ...updates } : t));
  const handleUpdateRequestStatus = (threadId: string, requestId: string, status: 'accepted' | 'rejected') => {
    persist(threads.map(t => {
      if (t.id !== threadId) return t;
      const req = t.collabRequests.find(r => r.id === requestId);
      if (!req) return t;
      return {
        ...t,
        collabRequests: t.collabRequests.map(r => r.id === requestId ? { ...r, status } : r),
        canEdit: status === 'accepted' && !t.canEdit.includes(req.user) ? [...t.canEdit, req.user] : t.canEdit
      };
    }));
  };

  return (
    <section className="collab-root">
      <h2 className="sr-only">Studio Collab</h2>

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="currentUser" className="text-sm font-medium accent-text">
          {c.currentUserLabel}
        </label>
        <input
          id="currentUser"
          value={currentUser}
          onChange={e => setCurrentUser(e.target.value)}
          className="border rounded-lg p-2 w-40 bg-transparent
                     border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none text-sm
                     text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500"
          placeholder="Guest"
        />
      </div>

      <div className="collab-form rounded-2xl border p-5 sm:p-6 bg-[var(--card)] border-[var(--border)]
                      text-sm text-neutral-800 dark:text-neutral-100">
        <p className="collab-hint text-center mb-4 text-subtle">{c.desc}</p>

        <div className="mt-4 grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input
              value={form.title || ""}
              onChange={e => setForm(f => ({...f, title: e.target.value}))}
              className="w-full border rounded-lg p-3 bg-transparent
                         border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none
                         text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500"
              placeholder={c.titlePlaceholder}
            />
            <input
              value={form.topic || ""}
              onChange={e => setForm(f => ({...f, topic: e.target.value}))}
              className="w-full border rounded-lg p-3 bg-transparent
                         border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none
                         text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500"
              placeholder={c.topicPlaceholder}
            />
          </div>

          <textarea
            value={form.body || ""}
            onChange={e => setForm(f => ({...f, body: e.target.value}))}
            className="w-full md:col-span-2 border rounded-lg p-3 h-36 bg-transparent
                       border-[var(--border)] focus:ring-1 focus:ring-amber-500 outline-none
                       text-neutral-900 dark:text-[#E7E3DA] placeholder-zinc-400 dark:placeholder-zinc-500"
            placeholder={c.bodyPlaceholder}
          />

          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <button
              onClick={handleAddThread}
              className="rounded-lg px-4 py-2 bg-neutral-900 text-white hover:opacity-95
                         dark:bg-neutral-100 dark:text-neutral-900"
            >
              {c.postButton}
            </button>
          </div>
        </div>
      </div>

      {threads.length === 0 ? (
        <p className="mt-8 text-center text-neutral-500 dark:text-neutral-300">{c.empty}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          <AnimatePresence>
            {threads.map(t => (
              <ThreadItem
                key={t.id}
                thread={t}
                currentUser={currentUser}
                onDelete={handleRemoveThread}
                onLike={handleLike}
                onComment={handleAddComment}
                onCollabRequest={handleAddCollabRequest}
                onUpdateRequestStatus={handleUpdateRequestStatus}
                onUpdateThread={handleUpdateThread}
                language={language as 'EN' | 'KR'}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
};

export default CollabSection;