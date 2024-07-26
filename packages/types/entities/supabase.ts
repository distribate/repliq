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
          admin_id: string | null
          created_at: string
          id: number
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_admins_admin_id_fkey"
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
            foreignKeyName: "public_category_threads_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: true
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
          id?: number
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
          id: number
          link: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          link?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          link?: string | null
          title?: string
        }
        Relationships: []
      }
      config_minecraft_facts: {
        Row: {
          fact: string | null
          id: number
        }
        Insert: {
          fact?: string | null
          id?: number
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
            foreignKeyName: "public_friends_requests_initiator_fkey"
            columns: ["initiator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "public_friends_requests_recipient_fkey"
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
        Relationships: []
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
      p_comments: {
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
            foreignKeyName: "public_comments_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
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
            foreignKeyName: "public_posts_comments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "p_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_posts_comments_post_id_fkey"
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
            foreignKeyName: "public_posts_users_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "public_posts_users_user_nickname_fkey"
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
          reason: Database["public"]["Enums"]["report_reason"] | null
          report_type: Database["public"]["Enums"]["report_type"] | null
          reported_item: Json | null
          target_user_nickname: string | null
          user_nickname: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          reason?: Database["public"]["Enums"]["report_reason"] | null
          report_type?: Database["public"]["Enums"]["report_type"] | null
          reported_item?: Json | null
          target_user_nickname?: string | null
          user_nickname?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          reason?: Database["public"]["Enums"]["report_reason"] | null
          report_type?: Database["public"]["Enums"]["report_type"] | null
          reported_item?: Json | null
          target_user_nickname?: string | null
          user_nickname?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_reports_target_user_nickname_fkey"
            columns: ["target_user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "public_reports_user_nickname_fkey"
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
          user_id?: string
          value?: boolean
        }
        Update: {
          user_id?: string
          value?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "public_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      t_comments: {
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
            foreignKeyName: "public_t_comments_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      t_comments_replies: {
        Row: {
          created_at: string
          id: number
          initiator_comment_id: string | null
          recipient_comment_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          initiator_comment_id?: string | null
          recipient_comment_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          initiator_comment_id?: string | null
          recipient_comment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_t_comments_replies_initiator_comment_id_fkey"
            columns: ["initiator_comment_id"]
            isOneToOne: false
            referencedRelation: "t_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_t_comments_replies_recipient_comment_id_fkey"
            columns: ["recipient_comment_id"]
            isOneToOne: false
            referencedRelation: "t_comments"
            referencedColumns: ["id"]
          },
        ]
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
        }
        Relationships: []
      }
      threads_comments: {
        Row: {
          comment_id: string
          id: number
          thread_id: string
        }
        Insert: {
          comment_id: string
          id?: number
          thread_id: string
        }
        Update: {
          comment_id?: string
          id?: number
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_threads_comments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "t_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_threads_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
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
            foreignKeyName: "public_threads_images_thread_id_fkey"
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
          id?: number
          thread_id: string
        }
        Update: {
          id?: number
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_threads_pinned_threads_id_fkey"
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
            foreignKeyName: "public_threads_stars_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_threads_stars_user_id_fkey"
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
          tags: Json[] | null
          thread_id: string
        }
        Insert: {
          id?: number
          tags?: Json[] | null
          thread_id: string
        }
        Update: {
          id?: number
          tags?: Json[] | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_threads_tags_thread_id_fkey"
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
            foreignKeyName: "public_threads_users_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: true
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_threads_users_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users: {
        Row: {
          accept_rules: boolean | null
          birthday: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          favorite_item: string | null
          id: string
          name_color: string
          nickname: string
          preferences: Json
          real_name: string | null
          status: string | null
          uuid: string
          visibility: Database["public"]["Enums"]["profile_visibility"]
        }
        Insert: {
          accept_rules?: boolean | null
          birthday?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          favorite_item?: string | null
          id?: string
          name_color?: string
          nickname: string
          preferences?: Json
          real_name?: string | null
          status?: string | null
          uuid: string
          visibility?: Database["public"]["Enums"]["profile_visibility"]
        }
        Update: {
          accept_rules?: boolean | null
          birthday?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          favorite_item?: string | null
          id?: string
          name_color?: string
          nickname?: string
          preferences?: Json
          real_name?: string | null
          status?: string | null
          uuid?: string
          visibility?: Database["public"]["Enums"]["profile_visibility"]
        }
        Relationships: []
      }
      users_banned: {
        Row: {
          created_at: string
          id: number
          nickname: string | null
          reason: string | null
          time: string
        }
        Insert: {
          created_at?: string
          id?: number
          nickname?: string | null
          reason?: string | null
          time: string
        }
        Update: {
          created_at?: string
          id?: number
          nickname?: string | null
          reason?: string | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_users_banned_nickname_fkey"
            columns: ["nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users_blocked: {
        Row: {
          created_at: string
          id: number
          user_1: string
          user_2: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_1: string
          user_2: string
        }
        Update: {
          created_at?: string
          id?: number
          user_1?: string
          user_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_users_blocked_user_1_fkey"
            columns: ["user_1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "public_users_blocked_user_2_fkey"
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
            foreignKeyName: "public_users_friends_user_1_fkey"
            columns: ["user_1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "public_users_friends_user_2_fkey"
            columns: ["user_2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
        ]
      }
      users_requests_timeout: {
        Row: {
          created_at: string
          id: number
          issued_at: string
          type: Database["public"]["Enums"]["request_timeout_type"] | null
          user_nickname: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          issued_at: string
          type?: Database["public"]["Enums"]["request_timeout_type"] | null
          user_nickname?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          issued_at?: string
          type?: Database["public"]["Enums"]["request_timeout_type"] | null
          user_nickname?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_users_requests_timeout_user_nickname_fkey"
            columns: ["user_nickname"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["nickname"]
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
        Relationships: []
      }
      users_session: {
        Row: {
          browser: string | null
          cpu: string | null
          created_at: string
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
          created_at?: string
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
          created_at?: string
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
          user_id: string
        }
        Insert: {
          user_id: string
        }
        Update: {
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_status: {
        Row: {
          id: number
          status: boolean | null
          user: string | null
        }
        Insert: {
          id?: number
          status?: boolean | null
          user?: string | null
        }
        Update: {
          id?: number
          status?: boolean | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_users_status_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        | "loyal"
        | "helper"
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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

