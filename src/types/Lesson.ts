export interface Course {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  creator_id: string;
  instructors: string[];
}
