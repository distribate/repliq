export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          admin_id: string
          created_at: string
          id: number
        }
        Insert: {
          admin_id: string
          created_at?: string
          id?: number
        }
        Update: {
          admin_id?: string
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "admins_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      AUTH: {
        Row: {
          HASH: string
          IP: string | null
          ISSUEDTIME: number | null
          LOGINDATE: number | null
          LOGINIP: string | null
          LOWERCASENICKNAME: string
          NICKNAME: string
          PREMIUMUUID: string | null
          REGDATE: number | null
          TOTPTOKEN: string | null
          UUID: string | null
        }
        Insert: {
          HASH: string
          IP?: string | null
          ISSUEDTIME?: number | null
          LOGINDATE?: number | null
          LOGINIP?: string | null
          LOWERCASENICKNAME: string
          NICKNAME: string
          PREMIUMUUID?: string | null
          REGDATE?: number | null
          TOTPTOKEN?: string | null
          UUID?: string | null
        }
        Update: {
          HASH?: string
          IP?: string | null
          ISSUEDTIME?: number | null
          LOGINDATE?: number | null
          LOGINIP?: string | null
          LOWERCASENICKNAME?: string
          NICKNAME?: string
          PREMIUMUUID?: string | null
          REGDATE?: number | null
          TOTPTOKEN?: string | null
          UUID?: string | null
        }
        Relationships: []
      }
      category: {
        Row: {
          available: boolean
          description: string | null
          id: number
          title: string
        }
        Insert: {
          available?: boolean
          description?: string | null
          id?: number
          title: string
        }
        Update: {
          available?: boolean
          description?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      category_threads: {
        Row: {
          category_id: number
          thread_id: string
        }
        Insert: {
          category_id: number
          thread_id: string
        }
        Update: {
          category_id?: number
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_threads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_threads_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      config_advertisement: {
        Row: {
          created_at: string
          description: string
          id: number
          link: string | null
          owner: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id: number
          link?: string | null
          owner: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          link?: string | null
          owner?: string
          title?: string
        }
        Relationships: []
      }
      config_alerts: {
        Row: {
          created_at: string
          creator: string
          description: string | null
          id: number
          link: string | null
          title: string
        }
        Insert: {
          created_at?: string
          creator: string
          description?: string | null
          id?: number
          link?: string | null
          title: string
        }
        Update: {
          created_at?: string
          creator?: string
          description?: string | null
          id?: number
          link?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "config_alerts_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      config_minecraft_facts: {
        Row: {
          fact: string | null
          id: number
        }
        Insert: {
          fact?: string | null
          id: number
        }
        Update: {
          fact?: string | null
          id?: number
        }
        Relationships: []
      }
      config_minecraft_items: {
        Row: {
          id: number
          image: string
          title: string
        }
        Insert: {
          id?: number
          image: string
          title: string
        }
        Update: {
          id?: number
          image?: string
          title?: string
        }
        Relationships: []
      }
      friends_notes: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          initiator: string
          note: string
          recipient: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          initiator: string
          note: string
          recipient: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          initiator?: string
          note?: string
          recipient?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_notes_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users_friends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_notes_initiator_fkey"
            columns: ["initiator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "friends_notes_recipient_fkey"
            columns: ["recipient"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      friends_pinned: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          initiator: string
          recipient: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          initiator: string
          recipient: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          initiator?: string
          recipient?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_pinned_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users_friends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_pinned_initiator_fkey"
            columns: ["initiator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "friends_pinned_recipient_fkey"
            columns: ["recipient"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      friends_requests: {
        Row: {
          created_at: string
          id: string
          initiator: string
          recipient: string
        }
        Insert: {
          created_at?: string
          id?: string
          initiator: string
          recipient: string
        }
        Update: {
          created_at?: string
          id?: string
          initiator?: string
          recipient?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_requests_initiator_fkey"
            columns: ["initiator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "friends_requests_recipient_fkey"
            columns: ["recipient"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      info_findout: {
        Row: {
          findout: string | null
          id: number
          user_nickname: string
        }
        Insert: {
          findout?: string | null
          id?: number
          user_nickname: string
        }
        Update: {
          findout?: string | null
          id?: number
          user_nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "info_findout_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      luckperms_actions: {
        Row: {
          acted_name: string
          acted_uuid: string
          action: string
          actor_name: string
          actor_uuid: string
          id: number
          time: number
          type: string
        }
        Insert: {
          acted_name: string
          acted_uuid: string
          action: string
          actor_name: string
          actor_uuid: string
          id?: number
          time: number
          type: string
        }
        Update: {
          acted_name?: string
          acted_uuid?: string
          action?: string
          actor_name?: string
          actor_uuid?: string
          id?: number
          time?: number
          type?: string
        }
        Relationships: []
      }
      luckperms_group_permissions: {
        Row: {
          contexts: string
          expiry: number
          id: number
          name: string
          permission: string
          server: string
          value: boolean
          world: string
        }
        Insert: {
          contexts: string
          expiry: number
          id?: number
          name: string
          permission: string
          server: string
          value: boolean
          world: string
        }
        Update: {
          contexts?: string
          expiry?: number
          id?: number
          name?: string
          permission?: string
          server?: string
          value?: boolean
          world?: string
        }
        Relationships: []
      }
      luckperms_groups: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      luckperms_players: {
        Row: {
          primary_group: string
          username: string
          uuid: string
        }
        Insert: {
          primary_group: string
          username: string
          uuid: string
        }
        Update: {
          primary_group?: string
          username?: string
          uuid?: string
        }
        Relationships: []
      }
      luckperms_tracks: {
        Row: {
          groups: string
          name: string
        }
        Insert: {
          groups: string
          name: string
        }
        Update: {
          groups?: string
          name?: string
        }
        Relationships: []
      }
      luckperms_user_permissions: {
        Row: {
          contexts: string
          expiry: number
          id: number
          permission: string
          server: string
          uuid: string
          value: boolean
          world: string
        }
        Insert: {
          contexts: string
          expiry: number
          id?: number
          permission: string
          server: string
          uuid: string
          value: boolean
          world: string
        }
        Update: {
          contexts?: string
          expiry?: number
          id?: number
          permission?: string
          server?: string
          uuid?: string
          value?: boolean
          world?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          comments: boolean
          content: string | null
          created_at: string
          post_id: string
          visibility: Database["public"]["Enums"]["post_visibility"]
        }
        Insert: {
          comments?: boolean
          content?: string | null
          created_at?: string
          post_id?: string
          visibility?: Database["public"]["Enums"]["post_visibility"]
        }
        Update: {
          comments?: boolean
          content?: string | null
          created_at?: string
          post_id?: string
          visibility?: Database["public"]["Enums"]["post_visibility"]
        }
        Relationships: []
      }
      posts_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          user_nickname: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_nickname: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "p_comments_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      posts_comments_ref: {
        Row: {
          comment_id: string
          id: number
          post_id: string
        }
        Insert: {
          comment_id: string
          id?: number
          post_id: string
        }
        Update: {
          comment_id?: string
          id?: number
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_comments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "posts_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      posts_users: {
        Row: {
          post_id: string
          user_nickname: string
        }
        Insert: {
          post_id: string
          user_nickname: string
        }
        Update: {
          post_id?: string
          user_nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_users_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "posts_users_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: number
          reason: string | null
          report_type: string | null
          reported_item: Json | null
          target_user_nickname: string | null
          user_nickname: string | null
        }
        Insert: {
          created_at?: string
          id: number
          reason?: string | null
          report_type?: string | null
          reported_item?: Json | null
          target_user_nickname?: string | null
          user_nickname?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          reason?: string | null
          report_type?: string | null
          reported_item?: Json | null
          target_user_nickname?: string | null
          user_nickname?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_target_user_nickname_fkey"
            columns: ["target_user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "reports_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      SOCIAL: {
        Row: {
          BLOCKED: boolean | null
          DISCORD_ID: number | null
          LOWERCASENICKNAME: string
          NOTIFY_ENABLED: boolean | null
          TELEGRAM_ID: number | null
          TOTP_ENABLED: boolean | null
          VK_ID: number | null
        }
        Insert: {
          BLOCKED?: boolean | null
          DISCORD_ID?: number | null
          LOWERCASENICKNAME: string
          NOTIFY_ENABLED?: boolean | null
          TELEGRAM_ID?: number | null
          TOTP_ENABLED?: boolean | null
          VK_ID?: number | null
        }
        Update: {
          BLOCKED?: boolean | null
          DISCORD_ID?: number | null
          LOWERCASENICKNAME?: string
          NOTIFY_ENABLED?: boolean | null
          TELEGRAM_ID?: number | null
          TOTP_ENABLED?: boolean | null
          VK_ID?: number | null
        }
        Relationships: []
      }
      status: {
        Row: {
          user_id: string
          value: boolean
        }
        Insert: {
          user_id: string
          value?: boolean
        }
        Update: {
          user_id?: string
          value?: boolean
        }
        Relationships: []
      }
      threads: {
        Row: {
          auto_remove: boolean
          comments: boolean
          content: Json
          created_at: string
          description: string | null
          id: string
          permission: boolean
          title: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["post_visibility"] | null
        }
        Insert: {
          auto_remove?: boolean
          comments?: boolean
          content: Json
          created_at?: string
          description?: string | null
          id?: string
          permission?: boolean
          title: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["post_visibility"] | null
        }
        Update: {
          auto_remove?: boolean
          comments?: boolean
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          permission?: boolean
          title?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["post_visibility"] | null
        }
        Relationships: []
      }
      threads_comments: {
        Row: {
          content: string
          created_at: string
          id: number
          thread_id: string
          user_nickname: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          thread_id: string
          user_nickname: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          thread_id?: string
          user_nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "t_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "t_comments_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      threads_comments_ref: {
        Row: {
          comment_id: number
          id: number
          thread_id: string
        }
        Insert: {
          comment_id?: number
          id?: number
          thread_id: string
        }
        Update: {
          comment_id?: number
          id?: number
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_comments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "threads_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      threads_comments_replies: {
        Row: {
          created_at: string
          id: number
          initiator_comment_id: number
          recipient_comment_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          initiator_comment_id: number
          recipient_comment_id: number
        }
        Update: {
          created_at?: string
          id?: number
          initiator_comment_id?: number
          recipient_comment_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "t_comments_replies_initiator_comment_id_fkey"
            columns: ["initiator_comment_id"]
            isOneToOne: false
            referencedRelation: "threads_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "t_comments_replies_recipient_comment_id_fkey"
            columns: ["recipient_comment_id"]
            isOneToOne: false
            referencedRelation: "threads_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      threads_images: {
        Row: {
          id: number
          images: string[]
          thread_id: string
        }
        Insert: {
          id?: number
          images: string[]
          thread_id: string
        }
        Update: {
          id?: number
          images?: string[]
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_images_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      threads_pinned: {
        Row: {
          id: number
          thread_id: string
        }
        Insert: {
          id: number
          thread_id: string
        }
        Update: {
          id?: number
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_pinned_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      threads_rating: {
        Row: {
          id: number
          thread_id: string
          type: Database["public"]["Enums"]["thread_rating_type"]
          user_id: string
        }
        Insert: {
          id?: number
          thread_id: string
          type: Database["public"]["Enums"]["thread_rating_type"]
          user_id: string
        }
        Update: {
          id?: number
          thread_id?: string
          type?: Database["public"]["Enums"]["thread_rating_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_rating_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_rating_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      threads_stars: {
        Row: {
          id: number
          thread_id: string
          user_id: string
        }
        Insert: {
          id?: number
          thread_id: string
          user_id: string
        }
        Update: {
          id?: number
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_stars_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_stars_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      threads_tags: {
        Row: {
          id: number
          tags: Json[]
          thread_id: string
        }
        Insert: {
          id?: number
          tags: Json[]
          thread_id: string
        }
        Update: {
          id?: number
          tags?: Json[]
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_tags_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      threads_users: {
        Row: {
          thread_id: string
          user_nickname: string
        }
        Insert: {
          thread_id: string
          user_nickname: string
        }
        Update: {
          thread_id?: string
          user_nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_users_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_users_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users: {
        Row: {
          acceptrules: boolean | null
          birthday: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          favorite_item: number | null
          id: string
          name_color: string
          nickname: string
          preferences: Json | null
          real_name: string | null
          status: string | null
          uuid: string
          visibility: Database["public"]["Enums"]["profile_visibility"]
        }
        Insert: {
          acceptrules?: boolean | null
          birthday?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          favorite_item?: number | null
          id?: string
          name_color?: string
          nickname: string
          preferences?: Json | null
          real_name?: string | null
          status?: string | null
          uuid: string
          visibility?: Database["public"]["Enums"]["profile_visibility"]
        }
        Update: {
          acceptrules?: boolean | null
          birthday?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          favorite_item?: number | null
          id?: string
          name_color?: string
          nickname?: string
          preferences?: Json | null
          real_name?: string | null
          status?: string | null
          uuid?: string
          visibility?: Database["public"]["Enums"]["profile_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "users_favorite_item_fkey"
            columns: ["favorite_item"]
            isOneToOne: false
            referencedRelation: "config_minecraft_items"
            referencedColumns: ["id"]
          },
        ]
      }
      users_banned: {
        Row: {
          created_at: string | null
          id: number
          nickname: string
          reason: string | null
          time: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          nickname: string
          reason?: string | null
          time: string
        }
        Update: {
          created_at?: string | null
          id?: number
          nickname?: string
          reason?: string | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_banned_nickname_fkey"
            columns: ["nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users_blocked: {
        Row: {
          created_at: string | null
          id: number
          user_1: string
          user_2: string
        }
        Insert: {
          created_at?: string | null
          id: number
          user_1: string
          user_2: string
        }
        Update: {
          created_at?: string | null
          id?: number
          user_1?: string
          user_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_blocked_user_1_fkey"
            columns: ["user_1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "users_blocked_user_2_fkey"
            columns: ["user_2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users_friends: {
        Row: {
          created_at: string
          id: string
          user_1: string
          user_2: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_1: string
          user_2: string
        }
        Update: {
          created_at?: string
          id?: string
          user_1?: string
          user_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_friends_user_1_fkey"
            columns: ["user_1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "users_friends_user_2_fkey"
            columns: ["user_2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users_requests_timeout: {
        Row: {
          created_at: string | null
          id: number
          issued_at: string | null
          type: Database["public"]["Enums"]["request_timeout_type"] | null
          user_nickname: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          issued_at?: string | null
          type?: Database["public"]["Enums"]["request_timeout_type"] | null
          user_nickname?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          issued_at?: string | null
          type?: Database["public"]["Enums"]["request_timeout_type"] | null
          user_nickname?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_requests_timeout_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users_saved_threads: {
        Row: {
          created_at: string
          id: string
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_saved_threads_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_saved_threads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_security: {
        Row: {
          email: string
          token: string | null
          user_nickname: string
        }
        Insert: {
          email: string
          token?: string | null
          user_nickname: string
        }
        Update: {
          email?: string
          token?: string | null
          user_nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_security_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users_session: {
        Row: {
          browser: string | null
          cpu: string | null
          expires_at: string
          id: string
          ip: string | null
          isBot: boolean | null
          os: string | null
          ua: string | null
          user_id: string
        }
        Insert: {
          browser?: string | null
          cpu?: string | null
          expires_at: string
          id: string
          ip?: string | null
          isBot?: boolean | null
          os?: string | null
          ua?: string | null
          user_id: string
        }
        Update: {
          browser?: string | null
          cpu?: string | null
          expires_at?: string
          id?: string
          ip?: string | null
          isBot?: boolean | null
          os?: string | null
          ua?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_session_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_settings: {
        Row: {
          id: number
          user_id: string
        }
        Insert: {
          id: number
          user_id: string
        }
        Update: {
          id?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_insert_user: {
        Args: {
          nick: string
          pass: string
        }
        Returns: undefined
      }
      edge_wrapper: {
        Args: {
          database: string
          table_name: string
          nickname: string
          uuid: string
        }
        Returns: Json
      }
      http_post_with_auth: {
        Args: {
          url_address: string
          post_data: string
          bearer: string
        }
        Returns: {
          _status: string
          _content: Json
        }[]
      }
      set_status: {
        Args: {
          p_user_id: string
          p_value: boolean
        }
        Returns: undefined
      }
      update_value_with_delay: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      donate_variants:
        | "default"
        | "authentic"
        | "helper"
        | "loyal"
        | "arkhont"
        | "dev"
        | "moder"
      post_visibility: "all" | "only" | "friends"
      profile_visibility: "all" | "friends"
      report_reason: "spam" | "offensive"
      report_type: "comment" | "post" | "thread" | "account"
      request_timeout_type:
        | "description"
        | "favorite_item"
        | "real_name"
        | "name_color"
      thread_rating_type: "decrement" | "increment"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

