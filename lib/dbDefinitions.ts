export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			chat_threads: {
				Row: {
					bible_version: string | null;
					book: string | null;
					chapter: number | null;
					date_created: string | null;
					end_verse: number | null;
					id: number;
					last_modified: string | null;
					llm_notes: Json | null;
					start_verse: number | null;
					thread_name: string | null;
					user_id: string | null;
					user_notes: string | null;
				};
				Insert: {
					bible_version?: string | null;
					book?: string | null;
					chapter?: number | null;
					date_created?: string | null;
					end_verse?: number | null;
					id?: number;
					last_modified?: string | null;
					llm_notes?: Json | null;
					start_verse?: number | null;
					thread_name?: string | null;
					user_id?: string | null;
					user_notes?: string | null;
				};
				Update: {
					bible_version?: string | null;
					book?: string | null;
					chapter?: number | null;
					date_created?: string | null;
					end_verse?: number | null;
					id?: number;
					last_modified?: string | null;
					llm_notes?: Json | null;
					start_verse?: number | null;
					thread_name?: string | null;
					user_id?: string | null;
					user_notes?: string | null;
				};
				Relationships: [];
			};
			notes: {
				Row: {
					id: number;
					title: string;
				};
				Insert: {
					id?: never;
					title: string;
				};
				Update: {
					id?: never;
					title?: string;
				};
				Relationships: [];
			};
			users: {
				Row: {
					email: string | null;
					firstname: string | null;
					id: number;
					lastname: string | null;
					password: string | null;
					user_id: string | null;
					username: string | null;
				};
				Insert: {
					email?: string | null;
					firstname?: string | null;
					id?: number;
					lastname?: string | null;
					password?: string | null;
					user_id?: string | null;
					username?: string | null;
				};
				Update: {
					email?: string | null;
					firstname?: string | null;
					id?: number;
					lastname?: string | null;
					password?: string | null;
					user_id?: string | null;
					username?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
	? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
	? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
	? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {},
	},
} as const;
