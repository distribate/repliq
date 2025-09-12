## Repliq

A modern social platform for creating and discussing threads with rich content and user interactions. Designed for seamless engagement, customizable profiles, and content management with integrated moderation and analytics tools.

---

### Features

#### Threads
- Users can create threads with text and images.
- Rich text editor: font size, bold, tables, to-do lists, etc...
- Categorization: 6 default thread categories.
- Visibility and commenting restrictions per thread.
- Recommendations based on categories and tags.
- Editable threads via a creative studio for owners.
- View count tracking.
- Thread reactions (similar to Telegram).

#### Posts
- Simple text posts without rich editor.
- Reactions support.
- Visibility settings: public, friends only, or private (draft).
- Post actions: delete, edit, pin (1 max), view counter.

#### User Profiles
- Profile customization: avatar (1 main + 4 optional), header image.
- Sections: posts, threads, friends, integrations, account.
- Section visibility: public or friends-only.
- Profiles hidden if user is blocked.
- Online/offline status tracking (5-minute inactivity threshold).

#### Friends
- Friend requests: send, accept, reject.
- Friend actions: pin, comment, remove.
- Filtering: current friends, incoming/outgoing requests.
- Simple friend suggestions based on mutual friends.

#### Categories & Discovery
- Category pages with filtered thread lists (most viewed, newest).
- Thread search by name, tags, or other filters.

#### Feedback & Support
- Ticket system for user feedback and bug reporting.
- Admin review, response, and potential rewards for critical bugs.
- User collections page: created threads, saved threads, tickets.

#### Administration
- Admin panel with announcements, broadcasts, ad management.
- Ticket and report processing.
- Automated notifications for suspicious content.
- User content restrictions (daily/monthly limits).

#### Dashboard & Analytics
- Profile and thread analytics: views and user interactions.
- Subscription unlocks: higher limits, profile customization, badges.

#### Integrations
- Telegram connection for notifications.
- Third-party service integration (Minecraft project account linking).

### Notifications
- Real-time notification system.
- Notification preferences in user settings.

---

### To-do
- ✅ Creating and managing threads and posts
- ✅ Threads commenting
- ✅ Creating tickets and reports
- ✅ Profile management
- ✅ Friends and threads recommendations
- ✅ Friend features (adding/removing, pinning, notes)
- ✅ User blacklist
- ✅ Global search for threads and users with various filters
- ✅ Content creation restrictions
- ✅ Rich-text editor
- ✅ User collection of threads and tickets
- 🔲 Subscription benefits
- Reaction system:
  - ✅ for threads
  - 🔲 for posts
- Admin panel:
  - 🔲 Monitoring various activities
  - 🔲 Managing users' tickets and reports
- Dashboard:
  - ✅ Profile analytics
  - 🔲 Threads analytics
- Studio:
  - 🔲 Threads control
- Integrations:
  - ✅ Telegram integration
  - 🔲 Connecting other social accounts
- Authorization:
  - 🔲 Password recovery
  - 🔲 Email linking
- 🔲 Add more categories

---

### Tech stack

- **Frontend:** TypeScript, React, Vike, TailwindCSS, Reatom, shadcn-ui (based on radix-ui)
- **Backend:** TypeScript, Bun, Hono, PostgreSQL, Redis, NATS, Kysely, Drizzle (for migrations), ioredis
- **Infra:** Docker, Traefik, Kong Gateway, Imgproxy, Supabase (storage, database, studio, analytics), Vault

---

### Licensing
The source code is licensed under GPL v3. License is available [here](/LICENSE).