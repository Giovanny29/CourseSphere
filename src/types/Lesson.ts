export interface Lesson {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  publish_date: string;
  video_url: string;
  course_id: string;
  creator_id: string;
}
