/**
 * البيانات اللازمة لإنشاء شكوى جديدة.
 * تُرسل من الـ Frontend إلى الـ Backend.
 */
export interface CreateTicketDto {
  guestName?: string;
  guestEmail?: string;
  subject: string;
  description: string;
  category: string;
  bookingId?: number;
}

/**
 * البيانات اللازمة لإضافة رد جديد على شكوى.
 */
export interface CreateReplyDto {
  content: string;
}

/**
 * ملخص الشكوى، يُستخدم لعرض قائمة بالشكاوى.
 * يتم استقباله من الـ Backend.
 */
export interface TicketSummaryDto {
  id: number;
  subject: string;
  status: string;
  priority: string;
  lastActivity: Date;
}

/**
 * التفاصيل الكاملة للشكوى، بما في ذلك كل الردود.
 * يتم استقباله من الـ Backend عند طلب شكوى معينة.
 */
export interface TicketDetailsDto {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  submitterName: string; // اسم مقدم الشكوى (سواء كان مستخدم أو زائر)
  replies: TicketReplyDto[];
}

/**
 * يمثل رداً واحداً داخل محادثة الشكوى.
 */
export interface TicketReplyDto {
  authorName: string; // اسم كاتب الرد (سواء كان مستخدم أو فريق الدعم)
  content: string;
  createdAt: Date;
}