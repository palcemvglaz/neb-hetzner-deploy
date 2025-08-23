--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."XPTransaction" DROP CONSTRAINT IF EXISTS "XPTransaction_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_schoolId_fkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_schoolGroupId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserSocialProfile" DROP CONSTRAINT IF EXISTS "UserSocialProfile_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserSegment" DROP CONSTRAINT IF EXISTS "UserSegment_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserMotorcycle" DROP CONSTRAINT IF EXISTS "UserMotorcycle_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserFlow" DROP CONSTRAINT IF EXISTS "UserFlow_createdBy_fkey";
ALTER TABLE IF EXISTS ONLY public."UserFlowNode" DROP CONSTRAINT IF EXISTS "UserFlowNode_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserFlowNode" DROP CONSTRAINT IF EXISTS "UserFlowNode_flowId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserBadge" DROP CONSTRAINT IF EXISTS "UserBadge_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserBadge" DROP CONSTRAINT IF EXISTS "UserBadge_badgeId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserAchievement" DROP CONSTRAINT IF EXISTS "UserAchievement_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."UserAchievement" DROP CONSTRAINT IF EXISTS "UserAchievement_achievementId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestSession" DROP CONSTRAINT IF EXISTS "TestSession_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestSession" DROP CONSTRAINT IF EXISTS "TestSession_testId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestResult" DROP CONSTRAINT IF EXISTS "TestResult_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestResult" DROP CONSTRAINT IF EXISTS "TestResult_testId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestResult" DROP CONSTRAINT IF EXISTS "TestResult_sessionId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestQuestion" DROP CONSTRAINT IF EXISTS "TestQuestion_testId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestAnswer" DROP CONSTRAINT IF EXISTS "TestAnswer_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestAnswer" DROP CONSTRAINT IF EXISTS "TestAnswer_sessionId_fkey";
ALTER TABLE IF EXISTS ONLY public."TestAnswer" DROP CONSTRAINT IF EXISTS "TestAnswer_questionId_fkey";
ALTER TABLE IF EXISTS ONLY public."StudentQuizResult" DROP CONSTRAINT IF EXISTS "StudentQuizResult_quizId_fkey";
ALTER TABLE IF EXISTS ONLY public."StudentQuizResult" DROP CONSTRAINT IF EXISTS "StudentQuizResult_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."StudentAnswer" DROP CONSTRAINT IF EXISTS "StudentAnswer_questionId_fkey";
ALTER TABLE IF EXISTS ONLY public."StreakRecord" DROP CONSTRAINT IF EXISTS "StreakRecord_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."StaticPage" DROP CONSTRAINT IF EXISTS "StaticPage_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."StaticPageTranslation" DROP CONSTRAINT IF EXISTS "StaticPageTranslation_pageId_fkey";
ALTER TABLE IF EXISTS ONLY public."StaticPageTag" DROP CONSTRAINT IF EXISTS "StaticPageTag_tagId_fkey";
ALTER TABLE IF EXISTS ONLY public."StaticPageTag" DROP CONSTRAINT IF EXISTS "StaticPageTag_pageId_fkey";
ALTER TABLE IF EXISTS ONLY public."ShippingAddress" DROP CONSTRAINT IF EXISTS "ShippingAddress_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."SessionBehavior" DROP CONSTRAINT IF EXISTS "SessionBehavior_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."SchoolInstructor" DROP CONSTRAINT IF EXISTS "SchoolInstructor_schoolId_fkey";
ALTER TABLE IF EXISTS ONLY public."SchoolGroup" DROP CONSTRAINT IF EXISTS "SchoolGroup_schoolId_fkey";
ALTER TABLE IF EXISTS ONLY public."SavedFilter" DROP CONSTRAINT IF EXISTS "SavedFilter_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."RiderTimelineEvent" DROP CONSTRAINT IF EXISTS "RiderTimelineEvent_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."RiderSkills" DROP CONSTRAINT IF EXISTS "RiderSkills_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."RiderSkillMap" DROP CONSTRAINT IF EXISTS "RiderSkillMap_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."RiderEvent" DROP CONSTRAINT IF EXISTS "RiderEvent_riderSkillsId_fkey";
ALTER TABLE IF EXISTS ONLY public."Referral" DROP CONSTRAINT IF EXISTS "Referral_referrerId_fkey";
ALTER TABLE IF EXISTS ONLY public."Referral" DROP CONSTRAINT IF EXISTS "Referral_referredUserId_fkey";
ALTER TABLE IF EXISTS ONLY public."RealtimeMetric" DROP CONSTRAINT IF EXISTS "RealtimeMetric_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Quiz" DROP CONSTRAINT IF EXISTS "Quiz_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuizQuestion" DROP CONSTRAINT IF EXISTS "QuizQuestion_quizId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuestionnaireProfile" DROP CONSTRAINT IF EXISTS "QuestionnaireProfile_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."QuestionnaireProfile" DROP CONSTRAINT IF EXISTS "QuestionnaireProfile_testResultId_fkey";
ALTER TABLE IF EXISTS ONLY public."Progress" DROP CONSTRAINT IF EXISTS "Progress_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Progress" DROP CONSTRAINT IF EXISTS "Progress_lessonId_fkey";
ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_sellerId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProductPurchase" DROP CONSTRAINT IF EXISTS "ProductPurchase_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProductPurchase" DROP CONSTRAINT IF EXISTS "ProductPurchase_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProductPurchase" DROP CONSTRAINT IF EXISTS "ProductPurchase_orderId_fkey";
ALTER TABLE IF EXISTS ONLY public."PracticeAttempt" DROP CONSTRAINT IF EXISTS "PracticeAttempt_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."PracticeAttempt" DROP CONSTRAINT IF EXISTS "PracticeAttempt_lessonId_fkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."PageTemplate" DROP CONSTRAINT IF EXISTS "PageTemplate_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."PageEngagement" DROP CONSTRAINT IF EXISTS "PageEngagement_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Order" DROP CONSTRAINT IF EXISTS "Order_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_orderId_fkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Module" DROP CONSTRAINT IF EXISTS "Module_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."Lesson" DROP CONSTRAINT IF EXISTS "Lesson_moduleId_fkey";
ALTER TABLE IF EXISTS ONLY public."LessonPageTemplate" DROP CONSTRAINT IF EXISTS "LessonPageTemplate_templateId_fkey";
ALTER TABLE IF EXISTS ONLY public."LessonPageTemplate" DROP CONSTRAINT IF EXISTS "LessonPageTemplate_lessonId_fkey";
ALTER TABLE IF EXISTS ONLY public."Leaderboard" DROP CONSTRAINT IF EXISTS "Leaderboard_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."KBNebSyncLog" DROP CONSTRAINT IF EXISTS "KBNebSyncLog_contentId_fkey";
ALTER TABLE IF EXISTS ONLY public."FeedbackSubmission" DROP CONSTRAINT IF EXISTS "FeedbackSubmission_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."FeatureUsage" DROP CONSTRAINT IF EXISTS "FeatureUsage_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Enrollment" DROP CONSTRAINT IF EXISTS "Enrollment_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Enrollment" DROP CONSTRAINT IF EXISTS "Enrollment_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."DynamicContent" DROP CONSTRAINT IF EXISTS "DynamicContent_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."DailyActivity" DROP CONSTRAINT IF EXISTS "DailyActivity_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Course" DROP CONSTRAINT IF EXISTS "Course_schoolId_fkey";
ALTER TABLE IF EXISTS ONLY public."Course" DROP CONSTRAINT IF EXISTS "Course_instructorId_fkey";
ALTER TABLE IF EXISTS ONLY public."CourseReview" DROP CONSTRAINT IF EXISTS "CourseReview_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."CourseReview" DROP CONSTRAINT IF EXISTS "CourseReview_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."ConversionFunnel" DROP CONSTRAINT IF EXISTS "ConversionFunnel_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."ContentEngagement" DROP CONSTRAINT IF EXISTS "ContentEngagement_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_lessonId_fkey";
ALTER TABLE IF EXISTS ONLY public."Certificate" DROP CONSTRAINT IF EXISTS "Certificate_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Certificate" DROP CONSTRAINT IF EXISTS "Certificate_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."Cart" DROP CONSTRAINT IF EXISTS "Cart_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."CartItem" DROP CONSTRAINT IF EXISTS "CartItem_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."CartItem" DROP CONSTRAINT IF EXISTS "CartItem_cartId_fkey";
ALTER TABLE IF EXISTS ONLY public."BatchAnalytic" DROP CONSTRAINT IF EXISTS "BatchAnalytic_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleSuggestion" DROP CONSTRAINT IF EXISTS "ArticleSuggestion_kbNebId_fkey";
ALTER TABLE IF EXISTS ONLY public."ArticleSuggestion" DROP CONSTRAINT IF EXISTS "ArticleSuggestion_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."Announcement" DROP CONSTRAINT IF EXISTS "Announcement_schoolId_fkey";
ALTER TABLE IF EXISTS ONLY public."Announcement" DROP CONSTRAINT IF EXISTS "Announcement_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public."AdminSettings" DROP CONSTRAINT IF EXISTS "AdminSettings_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AdaptiveTestResult" DROP CONSTRAINT IF EXISTS "AdaptiveTestResult_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AdaptiveTestResult" DROP CONSTRAINT IF EXISTS "AdaptiveTestResult_testId_fkey";
ALTER TABLE IF EXISTS ONLY public."AdaptiveTestResult" DROP CONSTRAINT IF EXISTS "AdaptiveTestResult_sessionId_fkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIUsageLog" DROP CONSTRAINT IF EXISTS "AIUsageLog_userId_fkey";
DROP INDEX IF EXISTS public."Waitlist_source_idx";
DROP INDEX IF EXISTS public."Waitlist_email_key";
DROP INDEX IF EXISTS public."Waitlist_email_idx";
DROP INDEX IF EXISTS public."VerificationToken_token_key";
DROP INDEX IF EXISTS public."VerificationToken_identifier_token_key";
DROP INDEX IF EXISTS public."User_stripeSubscriptionId_key";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."UserSocialProfile_userId_platform_key";
DROP INDEX IF EXISTS public."UserMotorcycle_userId_idx";
DROP INDEX IF EXISTS public."UserBadge_userId_badgeId_key";
DROP INDEX IF EXISTS public."UserAchievement_userId_achievementId_key";
DROP INDEX IF EXISTS public."TestResult_sessionId_key";
DROP INDEX IF EXISTS public."Tag_nameUa_key";
DROP INDEX IF EXISTS public."SystemSettings_key_key";
DROP INDEX IF EXISTS public."StreakRecord_userId_key";
DROP INDEX IF EXISTS public."StaticPage_slug_key";
DROP INDEX IF EXISTS public."StaticPageTranslation_pageId_language_key";
DROP INDEX IF EXISTS public."StaticPageTag_pageId_tagId_key";
DROP INDEX IF EXISTS public."Session_sessionToken_key";
DROP INDEX IF EXISTS public."RiderTimelineEvent_userId_eventDate_idx";
DROP INDEX IF EXISTS public."RiderTimelineEvent_eventType_idx";
DROP INDEX IF EXISTS public."RiderSkills_userId_key";
DROP INDEX IF EXISTS public."RiderSkillMap_userId_key";
DROP INDEX IF EXISTS public."RiderEvent_riderSkillsId_eventId_key";
DROP INDEX IF EXISTS public."Referral_referredUserId_key";
DROP INDEX IF EXISTS public."QuestionnaireProfile_userId_idx";
DROP INDEX IF EXISTS public."QuestionnaireProfile_type_idx";
DROP INDEX IF EXISTS public."QuestionnaireProfile_testResultId_key";
DROP INDEX IF EXISTS public."QuestionnaireProfile_riskProfile_idx";
DROP INDEX IF EXISTS public."QuestionnaireProfile_profileType_idx";
DROP INDEX IF EXISTS public."Progress_userId_lessonId_key";
DROP INDEX IF EXISTS public."Product_slug_key";
DROP INDEX IF EXISTS public."PageTemplate_slug_key";
DROP INDEX IF EXISTS public."Order_orderNumber_key";
DROP INDEX IF EXISTS public."Motorcycle_type_idx";
DROP INDEX IF EXISTS public."Motorcycle_fullName_idx";
DROP INDEX IF EXISTS public."Motorcycle_brand_idx";
DROP INDEX IF EXISTS public."Motorcycle_beginnerFriendly_idx";
DROP INDEX IF EXISTS public."Lesson_moduleId_slug_key";
DROP INDEX IF EXISTS public."Leaderboard_userId_period_key";
DROP INDEX IF EXISTS public."Enrollment_userId_courseId_key";
DROP INDEX IF EXISTS public."DailyActivity_userId_date_key";
DROP INDEX IF EXISTS public."Course_slug_key";
DROP INDEX IF EXISTS public."CourseReview_userId_courseId_key";
DROP INDEX IF EXISTS public."Certificate_userId_courseId_key";
DROP INDEX IF EXISTS public."Certificate_certificateNo_key";
DROP INDEX IF EXISTS public."Cart_userId_key";
DROP INDEX IF EXISTS public."CartItem_cartId_productId_key";
DROP INDEX IF EXISTS public."Badge_name_key";
DROP INDEX IF EXISTS public."AdminSettings_userId_key_key";
DROP INDEX IF EXISTS public."Achievement_name_key";
DROP INDEX IF EXISTS public."Account_provider_providerAccountId_key";
ALTER TABLE IF EXISTS ONLY public."XPTransaction" DROP CONSTRAINT IF EXISTS "XPTransaction_pkey";
ALTER TABLE IF EXISTS ONLY public."Waitlist" DROP CONSTRAINT IF EXISTS "Waitlist_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."UserSocialProfile" DROP CONSTRAINT IF EXISTS "UserSocialProfile_pkey";
ALTER TABLE IF EXISTS ONLY public."UserSegment" DROP CONSTRAINT IF EXISTS "UserSegment_pkey";
ALTER TABLE IF EXISTS ONLY public."UserMotorcycle" DROP CONSTRAINT IF EXISTS "UserMotorcycle_pkey";
ALTER TABLE IF EXISTS ONLY public."UserFlow" DROP CONSTRAINT IF EXISTS "UserFlow_pkey";
ALTER TABLE IF EXISTS ONLY public."UserFlowNode" DROP CONSTRAINT IF EXISTS "UserFlowNode_pkey";
ALTER TABLE IF EXISTS ONLY public."UserBadge" DROP CONSTRAINT IF EXISTS "UserBadge_pkey";
ALTER TABLE IF EXISTS ONLY public."UserAchievement" DROP CONSTRAINT IF EXISTS "UserAchievement_pkey";
ALTER TABLE IF EXISTS ONLY public."Test" DROP CONSTRAINT IF EXISTS "Test_pkey";
ALTER TABLE IF EXISTS ONLY public."TestSession" DROP CONSTRAINT IF EXISTS "TestSession_pkey";
ALTER TABLE IF EXISTS ONLY public."TestResult" DROP CONSTRAINT IF EXISTS "TestResult_pkey";
ALTER TABLE IF EXISTS ONLY public."TestQuestion" DROP CONSTRAINT IF EXISTS "TestQuestion_pkey";
ALTER TABLE IF EXISTS ONLY public."TestAnswer" DROP CONSTRAINT IF EXISTS "TestAnswer_pkey";
ALTER TABLE IF EXISTS ONLY public."Tag" DROP CONSTRAINT IF EXISTS "Tag_pkey";
ALTER TABLE IF EXISTS ONLY public."SystemSettings" DROP CONSTRAINT IF EXISTS "SystemSettings_pkey";
ALTER TABLE IF EXISTS ONLY public."StudentQuizResult" DROP CONSTRAINT IF EXISTS "StudentQuizResult_pkey";
ALTER TABLE IF EXISTS ONLY public."StudentAnswer" DROP CONSTRAINT IF EXISTS "StudentAnswer_pkey";
ALTER TABLE IF EXISTS ONLY public."StreakRecord" DROP CONSTRAINT IF EXISTS "StreakRecord_pkey";
ALTER TABLE IF EXISTS ONLY public."StaticPage" DROP CONSTRAINT IF EXISTS "StaticPage_pkey";
ALTER TABLE IF EXISTS ONLY public."StaticPageTranslation" DROP CONSTRAINT IF EXISTS "StaticPageTranslation_pkey";
ALTER TABLE IF EXISTS ONLY public."StaticPageTag" DROP CONSTRAINT IF EXISTS "StaticPageTag_pkey";
ALTER TABLE IF EXISTS ONLY public."ShippingAddress" DROP CONSTRAINT IF EXISTS "ShippingAddress_pkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_pkey";
ALTER TABLE IF EXISTS ONLY public."SessionBehavior" DROP CONSTRAINT IF EXISTS "SessionBehavior_pkey";
ALTER TABLE IF EXISTS ONLY public."School" DROP CONSTRAINT IF EXISTS "School_pkey";
ALTER TABLE IF EXISTS ONLY public."SchoolInstructor" DROP CONSTRAINT IF EXISTS "SchoolInstructor_pkey";
ALTER TABLE IF EXISTS ONLY public."SchoolGroup" DROP CONSTRAINT IF EXISTS "SchoolGroup_pkey";
ALTER TABLE IF EXISTS ONLY public."SavedFilter" DROP CONSTRAINT IF EXISTS "SavedFilter_pkey";
ALTER TABLE IF EXISTS ONLY public."RiderTimelineEvent" DROP CONSTRAINT IF EXISTS "RiderTimelineEvent_pkey";
ALTER TABLE IF EXISTS ONLY public."RiderSkills" DROP CONSTRAINT IF EXISTS "RiderSkills_pkey";
ALTER TABLE IF EXISTS ONLY public."RiderSkillMap" DROP CONSTRAINT IF EXISTS "RiderSkillMap_pkey";
ALTER TABLE IF EXISTS ONLY public."RiderEvent" DROP CONSTRAINT IF EXISTS "RiderEvent_pkey";
ALTER TABLE IF EXISTS ONLY public."Referral" DROP CONSTRAINT IF EXISTS "Referral_pkey";
ALTER TABLE IF EXISTS ONLY public."RealtimeMetric" DROP CONSTRAINT IF EXISTS "RealtimeMetric_pkey";
ALTER TABLE IF EXISTS ONLY public."Quiz" DROP CONSTRAINT IF EXISTS "Quiz_pkey";
ALTER TABLE IF EXISTS ONLY public."QuizQuestion" DROP CONSTRAINT IF EXISTS "QuizQuestion_pkey";
ALTER TABLE IF EXISTS ONLY public."QuestionnaireProfile" DROP CONSTRAINT IF EXISTS "QuestionnaireProfile_pkey";
ALTER TABLE IF EXISTS ONLY public."Progress" DROP CONSTRAINT IF EXISTS "Progress_pkey";
ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_pkey";
ALTER TABLE IF EXISTS ONLY public."ProductPurchase" DROP CONSTRAINT IF EXISTS "ProductPurchase_pkey";
ALTER TABLE IF EXISTS ONLY public."PracticeAttempt" DROP CONSTRAINT IF EXISTS "PracticeAttempt_pkey";
ALTER TABLE IF EXISTS ONLY public."Payment" DROP CONSTRAINT IF EXISTS "Payment_pkey";
ALTER TABLE IF EXISTS ONLY public."PageTemplate" DROP CONSTRAINT IF EXISTS "PageTemplate_pkey";
ALTER TABLE IF EXISTS ONLY public."PageEngagement" DROP CONSTRAINT IF EXISTS "PageEngagement_pkey";
ALTER TABLE IF EXISTS ONLY public."Order" DROP CONSTRAINT IF EXISTS "Order_pkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_pkey";
ALTER TABLE IF EXISTS ONLY public."Motorcycle" DROP CONSTRAINT IF EXISTS "Motorcycle_pkey";
ALTER TABLE IF EXISTS ONLY public."Module" DROP CONSTRAINT IF EXISTS "Module_pkey";
ALTER TABLE IF EXISTS ONLY public."Lesson" DROP CONSTRAINT IF EXISTS "Lesson_pkey";
ALTER TABLE IF EXISTS ONLY public."LessonPageTemplate" DROP CONSTRAINT IF EXISTS "LessonPageTemplate_pkey";
ALTER TABLE IF EXISTS ONLY public."Leaderboard" DROP CONSTRAINT IF EXISTS "Leaderboard_pkey";
ALTER TABLE IF EXISTS ONLY public."KBNebSyncLog" DROP CONSTRAINT IF EXISTS "KBNebSyncLog_pkey";
ALTER TABLE IF EXISTS ONLY public."KBNebContent" DROP CONSTRAINT IF EXISTS "KBNebContent_pkey";
ALTER TABLE IF EXISTS ONLY public."FeedbackSubmission" DROP CONSTRAINT IF EXISTS "FeedbackSubmission_pkey";
ALTER TABLE IF EXISTS ONLY public."FeatureUsage" DROP CONSTRAINT IF EXISTS "FeatureUsage_pkey";
ALTER TABLE IF EXISTS ONLY public."Enrollment" DROP CONSTRAINT IF EXISTS "Enrollment_pkey";
ALTER TABLE IF EXISTS ONLY public."DynamicContent" DROP CONSTRAINT IF EXISTS "DynamicContent_pkey";
ALTER TABLE IF EXISTS ONLY public."DailyActivity" DROP CONSTRAINT IF EXISTS "DailyActivity_pkey";
ALTER TABLE IF EXISTS ONLY public."Course" DROP CONSTRAINT IF EXISTS "Course_pkey";
ALTER TABLE IF EXISTS ONLY public."CourseReview" DROP CONSTRAINT IF EXISTS "CourseReview_pkey";
ALTER TABLE IF EXISTS ONLY public."ConversionFunnel" DROP CONSTRAINT IF EXISTS "ConversionFunnel_pkey";
ALTER TABLE IF EXISTS ONLY public."ContentEngagement" DROP CONSTRAINT IF EXISTS "ContentEngagement_pkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_pkey";
ALTER TABLE IF EXISTS ONLY public."Certificate" DROP CONSTRAINT IF EXISTS "Certificate_pkey";
ALTER TABLE IF EXISTS ONLY public."Cart" DROP CONSTRAINT IF EXISTS "Cart_pkey";
ALTER TABLE IF EXISTS ONLY public."CartItem" DROP CONSTRAINT IF EXISTS "CartItem_pkey";
ALTER TABLE IF EXISTS ONLY public."BatchAnalytic" DROP CONSTRAINT IF EXISTS "BatchAnalytic_pkey";
ALTER TABLE IF EXISTS ONLY public."Badge" DROP CONSTRAINT IF EXISTS "Badge_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
ALTER TABLE IF EXISTS ONLY public."ArticleSuggestion" DROP CONSTRAINT IF EXISTS "ArticleSuggestion_pkey";
ALTER TABLE IF EXISTS ONLY public."Announcement" DROP CONSTRAINT IF EXISTS "Announcement_pkey";
ALTER TABLE IF EXISTS ONLY public."AdminSettings" DROP CONSTRAINT IF EXISTS "AdminSettings_pkey";
ALTER TABLE IF EXISTS ONLY public."AdaptiveTestResult" DROP CONSTRAINT IF EXISTS "AdaptiveTestResult_pkey";
ALTER TABLE IF EXISTS ONLY public."Achievement" DROP CONSTRAINT IF EXISTS "Achievement_pkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_pkey";
ALTER TABLE IF EXISTS ONLY public."AIUsageLog" DROP CONSTRAINT IF EXISTS "AIUsageLog_pkey";
DROP TABLE IF EXISTS public."XPTransaction";
DROP TABLE IF EXISTS public."Waitlist";
DROP TABLE IF EXISTS public."VerificationToken";
DROP TABLE IF EXISTS public."UserSocialProfile";
DROP TABLE IF EXISTS public."UserSegment";
DROP TABLE IF EXISTS public."UserMotorcycle";
DROP TABLE IF EXISTS public."UserFlowNode";
DROP TABLE IF EXISTS public."UserFlow";
DROP TABLE IF EXISTS public."UserBadge";
DROP TABLE IF EXISTS public."UserAchievement";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."TestSession";
DROP TABLE IF EXISTS public."TestResult";
DROP TABLE IF EXISTS public."TestQuestion";
DROP TABLE IF EXISTS public."TestAnswer";
DROP TABLE IF EXISTS public."Test";
DROP TABLE IF EXISTS public."Tag";
DROP TABLE IF EXISTS public."SystemSettings";
DROP TABLE IF EXISTS public."StudentQuizResult";
DROP TABLE IF EXISTS public."StudentAnswer";
DROP TABLE IF EXISTS public."StreakRecord";
DROP TABLE IF EXISTS public."StaticPageTranslation";
DROP TABLE IF EXISTS public."StaticPageTag";
DROP TABLE IF EXISTS public."StaticPage";
DROP TABLE IF EXISTS public."ShippingAddress";
DROP TABLE IF EXISTS public."SessionBehavior";
DROP TABLE IF EXISTS public."Session";
DROP TABLE IF EXISTS public."SchoolInstructor";
DROP TABLE IF EXISTS public."SchoolGroup";
DROP TABLE IF EXISTS public."School";
DROP TABLE IF EXISTS public."SavedFilter";
DROP TABLE IF EXISTS public."RiderTimelineEvent";
DROP TABLE IF EXISTS public."RiderSkills";
DROP TABLE IF EXISTS public."RiderSkillMap";
DROP TABLE IF EXISTS public."RiderEvent";
DROP TABLE IF EXISTS public."Referral";
DROP TABLE IF EXISTS public."RealtimeMetric";
DROP TABLE IF EXISTS public."QuizQuestion";
DROP TABLE IF EXISTS public."Quiz";
DROP TABLE IF EXISTS public."QuestionnaireProfile";
DROP TABLE IF EXISTS public."Progress";
DROP TABLE IF EXISTS public."ProductPurchase";
DROP TABLE IF EXISTS public."Product";
DROP TABLE IF EXISTS public."PracticeAttempt";
DROP TABLE IF EXISTS public."Payment";
DROP TABLE IF EXISTS public."PageTemplate";
DROP TABLE IF EXISTS public."PageEngagement";
DROP TABLE IF EXISTS public."OrderItem";
DROP TABLE IF EXISTS public."Order";
DROP TABLE IF EXISTS public."Notification";
DROP TABLE IF EXISTS public."Motorcycle";
DROP TABLE IF EXISTS public."Module";
DROP TABLE IF EXISTS public."LessonPageTemplate";
DROP TABLE IF EXISTS public."Lesson";
DROP TABLE IF EXISTS public."Leaderboard";
DROP TABLE IF EXISTS public."KBNebSyncLog";
DROP TABLE IF EXISTS public."KBNebContent";
DROP TABLE IF EXISTS public."FeedbackSubmission";
DROP TABLE IF EXISTS public."FeatureUsage";
DROP TABLE IF EXISTS public."Enrollment";
DROP TABLE IF EXISTS public."DynamicContent";
DROP TABLE IF EXISTS public."DailyActivity";
DROP TABLE IF EXISTS public."CourseReview";
DROP TABLE IF EXISTS public."Course";
DROP TABLE IF EXISTS public."ConversionFunnel";
DROP TABLE IF EXISTS public."ContentEngagement";
DROP TABLE IF EXISTS public."Comment";
DROP TABLE IF EXISTS public."Certificate";
DROP TABLE IF EXISTS public."CartItem";
DROP TABLE IF EXISTS public."Cart";
DROP TABLE IF EXISTS public."BatchAnalytic";
DROP TABLE IF EXISTS public."Badge";
DROP TABLE IF EXISTS public."AuditLog";
DROP TABLE IF EXISTS public."ArticleSuggestion";
DROP TABLE IF EXISTS public."Announcement";
DROP TABLE IF EXISTS public."AdminSettings";
DROP TABLE IF EXISTS public."AdaptiveTestResult";
DROP TABLE IF EXISTS public."Achievement";
DROP TABLE IF EXISTS public."Account";
DROP TABLE IF EXISTS public."AIUsageLog";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AIUsageLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AIUsageLog" (
    id text NOT NULL,
    "userId" text NOT NULL,
    feature text NOT NULL,
    model text,
    "tokensUsed" integer,
    cost double precision,
    response text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- Name: Achievement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Achievement" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    icon text,
    rarity text DEFAULT 'common'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: AdaptiveTestResult; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AdaptiveTestResult" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "userId" text NOT NULL,
    "testId" text NOT NULL,
    "finalAbilityScore" double precision NOT NULL,
    "standardError" double precision,
    "itemsAdministered" integer NOT NULL,
    "convergenceReason" text,
    "competencyScores" text,
    "performanceLevel" text,
    recommendations text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: AdminSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AdminSettings" (
    id text NOT NULL,
    "userId" text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Announcement" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    type text DEFAULT 'info'::text NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    "courseId" text,
    "schoolId" text,
    "targetRole" text,
    "isPublished" boolean DEFAULT true NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ArticleSuggestion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ArticleSuggestion" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    "kbNebId" text,
    title text NOT NULL,
    description text,
    status text DEFAULT 'pending'::text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    "oldValues" text,
    "newValues" text,
    "ipAddress" text,
    "userAgent" text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Badge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Badge" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    category text NOT NULL,
    tier text DEFAULT 'bronze'::text NOT NULL,
    requirement text NOT NULL,
    "xpReward" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: BatchAnalytic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BatchAnalytic" (
    id text NOT NULL,
    "userId" text,
    "batchId" text NOT NULL,
    "eventType" text NOT NULL,
    "eventData" text NOT NULL,
    processed boolean DEFAULT false NOT NULL,
    "processedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Cart; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "cartId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Certificate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Certificate" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "certificateNo" text NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    grade double precision,
    honors text,
    "downloadUrl" text,
    "verifyUrl" text
);


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    "parentId" text,
    content text NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    "isEdited" boolean DEFAULT false NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ContentEngagement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContentEngagement" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "contentType" text NOT NULL,
    "contentId" text NOT NULL,
    "courseId" text,
    action text NOT NULL,
    duration integer,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ConversionFunnel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ConversionFunnel" (
    id text NOT NULL,
    "userId" text,
    "funnelName" text NOT NULL,
    step text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "timeSpent" integer,
    "dropoffPoint" text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Course; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    "shortDescription" text,
    "imageUrl" text,
    "videoUrl" text,
    price double precision DEFAULT 0 NOT NULL,
    "originalPrice" double precision,
    currency text DEFAULT 'UAH'::text NOT NULL,
    language text DEFAULT 'uk'::text NOT NULL,
    level text DEFAULT 'beginner'::text NOT NULL,
    duration integer,
    "totalLessons" integer DEFAULT 0 NOT NULL,
    "totalStudents" integer DEFAULT 0 NOT NULL,
    rating double precision DEFAULT 0 NOT NULL,
    "totalRatings" integer DEFAULT 0 NOT NULL,
    prerequisites text,
    "learningOutcomes" text,
    "targetAudience" text,
    includes text,
    requirements text,
    tags text,
    category text,
    subcategory text,
    status text DEFAULT 'draft'::text NOT NULL,
    visibility text DEFAULT 'public'::text NOT NULL,
    "enrollmentType" text DEFAULT 'open'::text NOT NULL,
    "certificateEnabled" boolean DEFAULT false NOT NULL,
    "forumEnabled" boolean DEFAULT false NOT NULL,
    "maxStudents" integer,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "enrollmentDeadline" timestamp(3) without time zone,
    "instructorId" text,
    "schoolId" text,
    "kbNebThemeId" text,
    "lastSyncedAt" timestamp(3) without time zone,
    "syncStatus" text,
    featured boolean DEFAULT false NOT NULL,
    "bestSeller" boolean DEFAULT false NOT NULL,
    "isNew" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "archivedAt" timestamp(3) without time zone,
    "searchVector" text
);


--
-- Name: CourseReview; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CourseReview" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    rating integer NOT NULL,
    title text,
    comment text,
    helpful integer DEFAULT 0 NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: DailyActivity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DailyActivity" (
    id text NOT NULL,
    "userId" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    minutes integer DEFAULT 0 NOT NULL,
    lessons integer DEFAULT 0 NOT NULL,
    "xpEarned" integer DEFAULT 0 NOT NULL,
    activities text
);


--
-- Name: DynamicContent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DynamicContent" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    "contentType" text NOT NULL,
    trigger text NOT NULL,
    content text NOT NULL,
    conditions text,
    priority integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Enrollment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    progress double precision DEFAULT 0 NOT NULL,
    "completedLessons" integer DEFAULT 0 NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "lastAccessedAt" timestamp(3) without time zone,
    "certificateId" text,
    grade double precision,
    notes text
);


--
-- Name: FeatureUsage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FeatureUsage" (
    id text NOT NULL,
    "userId" text,
    "featureName" text NOT NULL,
    action text NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: FeedbackSubmission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FeedbackSubmission" (
    id text NOT NULL,
    "userId" text,
    type text NOT NULL,
    category text,
    subject text NOT NULL,
    message text NOT NULL,
    rating integer,
    "pageUrl" text,
    status text DEFAULT 'new'::text NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    response text,
    "respondedAt" timestamp(3) without time zone,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: KBNebContent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KBNebContent" (
    id text NOT NULL,
    "themeId" text NOT NULL,
    format text NOT NULL,
    language text DEFAULT 'uk'::text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    metadata text,
    tags text,
    status text DEFAULT 'draft'::text NOT NULL,
    "lastSyncedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: KBNebSyncLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KBNebSyncLog" (
    id text NOT NULL,
    operation text NOT NULL,
    status text NOT NULL,
    "contentId" text,
    "errorMessage" text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Leaderboard; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Leaderboard" (
    id text NOT NULL,
    "userId" text NOT NULL,
    period text NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    rank integer,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Lesson" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    content text,
    "contentType" text DEFAULT 'article'::text NOT NULL,
    "videoUrl" text,
    duration integer,
    attachments text,
    "moduleId" text NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "isFree" boolean DEFAULT false NOT NULL,
    "releaseDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: LessonPageTemplate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LessonPageTemplate" (
    id text NOT NULL,
    "lessonId" text NOT NULL,
    "templateId" text NOT NULL,
    content text,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Module; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Module" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "courseId" text NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    duration integer,
    "isPublished" boolean DEFAULT false NOT NULL,
    "isFree" boolean DEFAULT false NOT NULL,
    "releaseDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Motorcycle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Motorcycle" (
    id text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    "fullName" text NOT NULL,
    type text NOT NULL,
    "engineSize" integer NOT NULL,
    year integer,
    "hasABS" boolean DEFAULT false NOT NULL,
    "difficultyLevel" text NOT NULL,
    "riskCategory" text NOT NULL,
    "beginnerFriendly" boolean DEFAULT false NOT NULL,
    "popularityRank" integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info'::text NOT NULL,
    link text,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "orderNumber" text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    total double precision NOT NULL,
    currency text DEFAULT 'UAH'::text NOT NULL,
    "shippingAddress" text,
    "billingAddress" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL
);


--
-- Name: PageEngagement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PageEngagement" (
    id text NOT NULL,
    "userId" text,
    "sessionId" text NOT NULL,
    "pageUrl" text NOT NULL,
    "pageTitle" text,
    referrer text,
    "timeOnPage" integer NOT NULL,
    "scrollDepth" double precision,
    clicks integer DEFAULT 0 NOT NULL,
    interactions text,
    "deviceType" text,
    browser text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: PageTemplate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PageTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    category text NOT NULL,
    description text,
    content text NOT NULL,
    thumbnail text,
    variables text,
    "isPublic" boolean DEFAULT false NOT NULL,
    "courseId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount double precision NOT NULL,
    currency text DEFAULT 'UAH'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    type text NOT NULL,
    description text,
    "stripePaymentId" text,
    "stripeInvoiceId" text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PracticeAttempt; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PracticeAttempt" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    score double precision NOT NULL,
    "timeSpent" integer NOT NULL,
    answers text,
    feedback text,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    price double precision NOT NULL,
    currency text DEFAULT 'UAH'::text NOT NULL,
    category text NOT NULL,
    "imageUrl" text,
    stock integer DEFAULT 0 NOT NULL,
    "sellerId" text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ProductPurchase; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductPurchase" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "orderId" text,
    price double precision NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Progress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "timeSpent" integer DEFAULT 0 NOT NULL,
    "lastAccessedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "videoProgress" double precision,
    notes text,
    bookmarked boolean DEFAULT false NOT NULL
);


--
-- Name: QuestionnaireProfile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."QuestionnaireProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "testResultId" text,
    type text,
    answers jsonb,
    "profileType" text NOT NULL,
    "riskScore" double precision,
    "confidenceScore" double precision,
    "safetyScore" double precision,
    "skillsScore" double precision,
    "knowledgeScore" double precision,
    "psychologyScore" double precision,
    "riskAwareness" double precision,
    "overallLevel" text,
    "riskProfile" text,
    "redFlags" jsonb,
    recommendations jsonb,
    "segmentData" jsonb,
    "motorcycleId" text,
    "timePerQuestion" jsonb,
    "completionTime" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Quiz; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quiz" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "courseId" text NOT NULL,
    "passingScore" integer DEFAULT 60 NOT NULL,
    "timeLimit" integer,
    "randomizeQuestions" boolean DEFAULT false NOT NULL,
    "showCorrectAnswers" boolean DEFAULT true NOT NULL,
    "maxAttempts" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: QuizQuestion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."QuizQuestion" (
    id text NOT NULL,
    "quizId" text NOT NULL,
    question text NOT NULL,
    type text DEFAULT 'multiple_choice'::text NOT NULL,
    options text,
    "correctAnswer" text NOT NULL,
    explanation text,
    points integer DEFAULT 1 NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL
);


--
-- Name: RealtimeMetric; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RealtimeMetric" (
    id text NOT NULL,
    "userId" text,
    "metricName" text NOT NULL,
    value double precision NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata text
);


--
-- Name: Referral; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Referral" (
    id text NOT NULL,
    "referrerId" text NOT NULL,
    "referredUserId" text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "rewardClaimed" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone
);


--
-- Name: RiderEvent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RiderEvent" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    "riderSkillsId" text NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text
);


--
-- Name: RiderSkillMap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RiderSkillMap" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "basicSkills" jsonb NOT NULL,
    "advancedSkills" jsonb NOT NULL,
    "stuntSkills" jsonb NOT NULL,
    "safetySkills" jsonb NOT NULL,
    "overallLevel" integer NOT NULL,
    "totalRidingHours" integer,
    "totalDistance" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: RiderSkills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RiderSkills" (
    id text NOT NULL,
    "userId" text NOT NULL,
    skills jsonb NOT NULL,
    "totalDistance" integer DEFAULT 0 NOT NULL,
    "ridingMonths" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: RiderTimelineEvent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RiderTimelineEvent" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "eventType" text NOT NULL,
    "eventDate" timestamp(3) without time zone NOT NULL,
    title text NOT NULL,
    description text,
    metadata jsonb,
    icon text,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: SavedFilter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SavedFilter" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    "filterType" text NOT NULL,
    "filterData" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: School; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."School" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    logo text,
    "coverImage" text,
    address text,
    phone text,
    email text,
    website text,
    "subscriptionStatus" text DEFAULT 'FREE'::text NOT NULL,
    "subscriptionTier" text DEFAULT 'FREE'::text NOT NULL,
    "stripeCustomerId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: SchoolGroup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SchoolGroup" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "schoolId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: SchoolInstructor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SchoolInstructor" (
    id text NOT NULL,
    "schoolId" text NOT NULL,
    "instructorId" text NOT NULL,
    role text DEFAULT 'INSTRUCTOR'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: SessionBehavior; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SessionBehavior" (
    id text NOT NULL,
    "userId" text,
    "sessionId" text NOT NULL,
    events text NOT NULL,
    patterns text,
    anomalies text,
    "riskScore" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ShippingAddress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ShippingAddress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    state text,
    "postalCode" text NOT NULL,
    country text NOT NULL,
    phone text,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: StaticPage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StaticPage" (
    id text NOT NULL,
    slug text NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "order" integer,
    level integer DEFAULT 1 NOT NULL,
    "parentId" text,
    "metaTitle" text,
    "metaDescription" text,
    "allowComments" boolean DEFAULT false NOT NULL,
    "showInNavigation" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: StaticPageTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StaticPageTag" (
    id text NOT NULL,
    "pageId" text NOT NULL,
    "tagId" text NOT NULL
);


--
-- Name: StaticPageTranslation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StaticPageTranslation" (
    id text NOT NULL,
    "pageId" text NOT NULL,
    language text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    excerpt text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: StreakRecord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StreakRecord" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "currentStreak" integer DEFAULT 0 NOT NULL,
    "longestStreak" integer DEFAULT 0 NOT NULL,
    "lastActiveDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "streakStartDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "frozenDays" integer DEFAULT 0 NOT NULL
);


--
-- Name: StudentAnswer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudentAnswer" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "questionId" text NOT NULL,
    answer text NOT NULL,
    "isCorrect" boolean NOT NULL,
    "pointsEarned" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: StudentQuizResult; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudentQuizResult" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "quizId" text NOT NULL,
    "courseId" text NOT NULL,
    score double precision NOT NULL,
    passed boolean NOT NULL,
    "attemptNumber" integer DEFAULT 1 NOT NULL,
    "timeSpent" integer,
    answers text,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: SystemSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SystemSettings" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    description text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    "nameUa" text NOT NULL,
    "nameEn" text,
    color text DEFAULT '#3B82F6'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Test; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Test" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    category text,
    difficulty text DEFAULT 'medium'::text NOT NULL,
    "timeLimit" integer,
    "passingScore" integer DEFAULT 70 NOT NULL,
    "totalQuestions" integer DEFAULT 0 NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "isAdaptive" boolean DEFAULT false NOT NULL,
    instructions text,
    "allowReview" boolean DEFAULT true NOT NULL,
    "shuffleQuestions" boolean DEFAULT false NOT NULL,
    "maxAttempts" integer,
    tags text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TestAnswer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TestAnswer" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "questionId" text NOT NULL,
    "userId" text NOT NULL,
    answer text NOT NULL,
    "isCorrect" boolean NOT NULL,
    "timeSpent" integer,
    confidence integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TestQuestion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TestQuestion" (
    id text NOT NULL,
    "testId" text NOT NULL,
    question text NOT NULL,
    type text DEFAULT 'multiple_choice'::text NOT NULL,
    options text,
    "correctAnswer" text NOT NULL,
    explanation text,
    points integer DEFAULT 1 NOT NULL,
    difficulty integer DEFAULT 2 NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "imageUrl" text,
    "competencyArea" text,
    "subCompetency" text,
    metadata text
);


--
-- Name: TestResult; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TestResult" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "userId" text NOT NULL,
    "testId" text NOT NULL,
    score double precision NOT NULL,
    percentage double precision NOT NULL,
    passed boolean NOT NULL,
    "correctAnswers" integer NOT NULL,
    "totalQuestions" integer NOT NULL,
    "timeSpent" integer,
    feedback text,
    certificate text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TestSession; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TestSession" (
    id text NOT NULL,
    "testId" text NOT NULL,
    "userId" text NOT NULL,
    status text DEFAULT 'in_progress'::text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "timeSpent" integer,
    "currentQuestionId" text,
    metadata text
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    password text,
    name text,
    image text,
    role text DEFAULT 'STUDENT'::text NOT NULL,
    phone text,
    "dateOfBirth" timestamp(3) without time zone,
    "schoolId" text,
    "schoolGroupId" text,
    "stripeCustomerId" text,
    "stripeSubscriptionId" text,
    "subscriptionStatus" text,
    "subscriptionTier" text DEFAULT 'FREE'::text NOT NULL,
    "subscriptionCurrentPeriodEnd" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "defaultShippingAddress" text,
    "preferredShippingMethod" text,
    wishlist text,
    "loyaltyPoints" integer DEFAULT 0 NOT NULL,
    "loyaltyTier" text DEFAULT 'bronze'::text NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" text,
    "deletionReason" text,
    "riderProfile" text,
    "riderProfileData" jsonb
);


--
-- Name: UserAchievement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserAchievement" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "achievementId" text NOT NULL,
    "unlockedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    progress double precision DEFAULT 0 NOT NULL
);


--
-- Name: UserBadge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserBadge" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "badgeId" text NOT NULL,
    "earnedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: UserFlow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserFlow" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdBy" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: UserFlowNode; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserFlowNode" (
    id text NOT NULL,
    "flowId" text NOT NULL,
    "userId" text NOT NULL,
    "nodeName" text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "timeSpent" integer,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: UserMotorcycle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserMotorcycle" (
    id text NOT NULL,
    "userId" text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    year integer,
    "engineSize" integer,
    "purchaseDate" timestamp(3) without time zone,
    "sellDate" timestamp(3) without time zone,
    "isCurrent" boolean DEFAULT false NOT NULL,
    photos jsonb,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: UserSegment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserSegment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "segmentName" text NOT NULL,
    "segmentValue" text NOT NULL,
    confidence double precision,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: UserSocialProfile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserSocialProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    platform text NOT NULL,
    "profileUrl" text NOT NULL,
    username text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: Waitlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Waitlist" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    phone text,
    interests text,
    source text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: XPTransaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."XPTransaction" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount integer NOT NULL,
    type text NOT NULL,
    description text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: AIUsageLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AIUsageLog" (id, "userId", feature, model, "tokensUsed", cost, response, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Achievement; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Achievement" (id, name, description, category, points, icon, rarity, "createdAt") FROM stdin;
\.


--
-- Data for Name: AdaptiveTestResult; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AdaptiveTestResult" (id, "sessionId", "userId", "testId", "finalAbilityScore", "standardError", "itemsAdministered", "convergenceReason", "competencyScores", "performanceLevel", recommendations, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: AdminSettings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AdminSettings" (id, "userId", key, value, "updatedAt") FROM stdin;
\.


--
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Announcement" (id, title, content, type, priority, "courseId", "schoolId", "targetRole", "isPublished", "publishedAt", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ArticleSuggestion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ArticleSuggestion" (id, "courseId", "kbNebId", title, description, status, priority, metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AuditLog" (id, "userId", action, entity, "entityId", "oldValues", "newValues", "ipAddress", "userAgent", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: Badge; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Badge" (id, name, description, icon, category, tier, requirement, "xpReward", "createdAt") FROM stdin;
\.


--
-- Data for Name: BatchAnalytic; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BatchAnalytic" (id, "userId", "batchId", "eventType", "eventData", processed, "processedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Cart" (id, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CartItem" (id, "cartId", "productId", quantity, "createdAt") FROM stdin;
\.


--
-- Data for Name: Certificate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Certificate" (id, "userId", "courseId", "certificateNo", "issueDate", "expiryDate", grade, honors, "downloadUrl", "verifyUrl") FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comment" (id, "userId", "lessonId", "parentId", content, likes, "isEdited", "isPinned", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ContentEngagement; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ContentEngagement" (id, "userId", "contentType", "contentId", "courseId", action, duration, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: ConversionFunnel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ConversionFunnel" (id, "userId", "funnelName", step, completed, "timeSpent", "dropoffPoint", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Course" (id, title, slug, description, "shortDescription", "imageUrl", "videoUrl", price, "originalPrice", currency, language, level, duration, "totalLessons", "totalStudents", rating, "totalRatings", prerequisites, "learningOutcomes", "targetAudience", includes, requirements, tags, category, subcategory, status, visibility, "enrollmentType", "certificateEnabled", "forumEnabled", "maxStudents", "startDate", "endDate", "enrollmentDeadline", "instructorId", "schoolId", "kbNebThemeId", "lastSyncedAt", "syncStatus", featured, "bestSeller", "isNew", "createdAt", "updatedAt", "publishedAt", "archivedAt", "searchVector") FROM stdin;
\.


--
-- Data for Name: CourseReview; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CourseReview" (id, "userId", "courseId", rating, title, comment, helpful, verified, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DailyActivity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."DailyActivity" (id, "userId", date, minutes, lessons, "xpEarned", activities) FROM stdin;
\.


--
-- Data for Name: DynamicContent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."DynamicContent" (id, "courseId", "contentType", trigger, content, conditions, priority, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Enrollment" (id, "userId", "courseId", status, progress, "completedLessons", "startedAt", "completedAt", "lastAccessedAt", "certificateId", grade, notes) FROM stdin;
\.


--
-- Data for Name: FeatureUsage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FeatureUsage" (id, "userId", "featureName", action, count, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: FeedbackSubmission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FeedbackSubmission" (id, "userId", type, category, subject, message, rating, "pageUrl", status, priority, response, "respondedAt", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: KBNebContent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."KBNebContent" (id, "themeId", format, language, title, content, metadata, tags, status, "lastSyncedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: KBNebSyncLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."KBNebSyncLog" (id, operation, status, "contentId", "errorMessage", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: Leaderboard; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Leaderboard" (id, "userId", period, score, rank, metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Lesson" (id, title, slug, description, content, "contentType", "videoUrl", duration, attachments, "moduleId", "orderIndex", "isPublished", "isFree", "releaseDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LessonPageTemplate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LessonPageTemplate" (id, "lessonId", "templateId", content, "orderIndex", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Module; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Module" (id, title, description, "courseId", "orderIndex", duration, "isPublished", "isFree", "releaseDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Motorcycle; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Motorcycle" (id, brand, model, "fullName", type, "engineSize", year, "hasABS", "difficultyLevel", "riskCategory", "beginnerFriendly", "popularityRank", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (id, "userId", title, message, type, link, "isRead", "readAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Order" (id, "userId", "orderNumber", status, total, currency, "shippingAddress", "billingAddress", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, price) FROM stdin;
\.


--
-- Data for Name: PageEngagement; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PageEngagement" (id, "userId", "sessionId", "pageUrl", "pageTitle", referrer, "timeOnPage", "scrollDepth", clicks, interactions, "deviceType", browser, "createdAt") FROM stdin;
\.


--
-- Data for Name: PageTemplate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PageTemplate" (id, name, slug, category, description, content, thumbnail, variables, "isPublic", "courseId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Payment" (id, "userId", amount, currency, status, type, description, "stripePaymentId", "stripeInvoiceId", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PracticeAttempt; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PracticeAttempt" (id, "userId", "lessonId", score, "timeSpent", answers, feedback, "completedAt") FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Product" (id, title, slug, description, price, currency, category, "imageUrl", stock, "sellerId", status, featured, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProductPurchase; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductPurchase" (id, "userId", "productId", "orderId", price, quantity, "createdAt") FROM stdin;
\.


--
-- Data for Name: Progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Progress" (id, "userId", "lessonId", completed, "completedAt", "timeSpent", "lastAccessedAt", "videoProgress", notes, bookmarked) FROM stdin;
\.


--
-- Data for Name: QuestionnaireProfile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."QuestionnaireProfile" (id, "userId", "testResultId", type, answers, "profileType", "riskScore", "confidenceScore", "safetyScore", "skillsScore", "knowledgeScore", "psychologyScore", "riskAwareness", "overallLevel", "riskProfile", "redFlags", recommendations, "segmentData", "motorcycleId", "timePerQuestion", "completionTime", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Quiz" (id, title, description, "courseId", "passingScore", "timeLimit", "randomizeQuestions", "showCorrectAnswers", "maxAttempts", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: QuizQuestion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."QuizQuestion" (id, "quizId", question, type, options, "correctAnswer", explanation, points, "orderIndex") FROM stdin;
\.


--
-- Data for Name: RealtimeMetric; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RealtimeMetric" (id, "userId", "metricName", value, "timestamp", metadata) FROM stdin;
\.


--
-- Data for Name: Referral; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Referral" (id, "referrerId", "referredUserId", status, "rewardClaimed", "createdAt", "completedAt") FROM stdin;
\.


--
-- Data for Name: RiderEvent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RiderEvent" (id, "eventId", "riderSkillsId", "completedAt", notes) FROM stdin;
\.


--
-- Data for Name: RiderSkillMap; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RiderSkillMap" (id, "userId", "basicSkills", "advancedSkills", "stuntSkills", "safetySkills", "overallLevel", "totalRidingHours", "totalDistance", "createdAt", "updatedAt") FROM stdin;
cmelk2sha0001z1epynhtkleu	cm1234student2	{"balance": 85, "braking": 88, "parking": 95, "turning": 87, "shifting": 92, "throttleControl": 90}	{"mistRiding": 60, "rainRiding": 65, "nightRiding": 70, "bodyPosition": 85, "trailBraking": 70, "corneringSpeed": 73, "countersteering": 75, "lanePositioning": 82, "emergencyBraking": 78, "coldWeatherRiding": 68}	{"burnout": 50, "stoppie": 35, "wheelie": 45, "drifting": 30}	{"groupRiding": 85, "defensiveRiding": 90, "nightVisibility": 75, "hazardPerception": 88, "trafficAwareness": 92, "weatherAdaptation": 80}	75	\N	\N	2025-08-21 15:27:55.054	2025-08-21 15:28:58.408
cmelk3phj0008z1g35zmdl4oz	cm1234student1	{"balance": 45, "braking": 50, "parking": 60, "turning": 42, "shifting": 55, "throttleControl": 40}	{"mistRiding": 15, "rainRiding": 20, "nightRiding": 25, "bodyPosition": 35, "trailBraking": 15, "corneringSpeed": 28, "countersteering": 20, "lanePositioning": 30, "emergencyBraking": 25, "coldWeatherRiding": 22}	{"burnout": 10, "stoppie": 0, "wheelie": 5, "drifting": 0}	{"groupRiding": 40, "defensiveRiding": 60, "nightVisibility": 50, "hazardPerception": 55, "trafficAwareness": 65, "weatherAdaptation": 45}	35	\N	\N	2025-08-21 15:28:37.832	2025-08-21 15:28:58.422
\.


--
-- Data for Name: RiderSkills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RiderSkills" (id, "userId", skills, "totalDistance", "ridingMonths", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: RiderTimelineEvent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RiderTimelineEvent" (id, "userId", "eventType", "eventDate", title, description, metadata, icon, "isPublic", "createdAt") FROM stdin;
cmelk45db0002z1hf5z9hphk3	cm1234student2	LICENSE_OBTAINED	2023-05-15 00:00:00	Отримав категорію А	Успішно склав іспит в мотошколі	{"score": 95, "school": "Kyiv Moto School"}	\N	t	2025-08-21 15:28:58.415
cmelk45db0003z1hfvcejopgn	cm1234student2	FIRST_BIKE	2023-06-01 00:00:00	Купив перший мотоцикл	Honda CB650R - мрія збулась!	{"bike": "Honda CB650R", "year": 2023}	\N	t	2025-08-21 15:28:58.415
cmelk45db0004z1hfndykh1co	cm1234student2	ACHIEVEMENT	2023-08-20 00:00:00	Перша далека поїздка	500км по Карпатах за один день	{"distance": 500, "location": "Carpathians"}	\N	t	2025-08-21 15:28:58.415
cmelk45db0005z1hfarzz8yiz	cm1234student2	COURSE_COMPLETED	2024-03-10 00:00:00	Пройшов курс безпечного водіння	Nebachiv Advanced Safety Course	{"score": 88, "courseId": "safety-advanced"}	\N	t	2025-08-21 15:28:58.415
cmelk45db0006z1hfr29i8vw9	cm1234student2	MILESTONE	2024-09-15 00:00:00	10,000 км пробігу	Досягнув позначки 10000 км без аварій	{"totalKm": 10000, "accidents": 0}	\N	t	2025-08-21 15:28:58.415
cmelk45dn0009z1hfwyi0c3t1	cm1234student1	LICENSE_OBTAINED	2024-10-01 00:00:00	Отримав категорію А	Щойно склав іспит!	{"score": 82, "school": "Local Moto School"}	\N	t	2025-08-21 15:28:58.427
cmelk45dn000az1hf4ysjsq72	cm1234student1	FIRST_BIKE	2024-10-15 00:00:00	Купив першій мотоцикл	Yamaha MT-03 для початківця	{"bike": "Yamaha MT-03", "year": 2024}	\N	t	2025-08-21 15:28:58.427
cmelk45dn000bz1hfali26q6a	cm1234student1	TRAINING	2024-10-20 00:00:00	Перша тренувальна сесія	Практика на парковці	{"duration": "2 hours", "location": "Parking lot"}	\N	t	2025-08-21 15:28:58.427
\.


--
-- Data for Name: SavedFilter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SavedFilter" (id, "userId", name, "filterType", "filterData", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: School; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."School" (id, name, description, logo, "coverImage", address, phone, email, website, "subscriptionStatus", "subscriptionTier", "stripeCustomerId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SchoolGroup; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SchoolGroup" (id, name, description, "schoolId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SchoolInstructor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SchoolInstructor" (id, "schoolId", "instructorId", role, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: SessionBehavior; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SessionBehavior" (id, "userId", "sessionId", events, patterns, anomalies, "riskScore", "createdAt") FROM stdin;
\.


--
-- Data for Name: ShippingAddress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ShippingAddress" (id, "userId", name, street, city, state, "postalCode", country, phone, "isDefault", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StaticPage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StaticPage" (id, slug, "isPublished", "order", level, "parentId", "metaTitle", "metaDescription", "allowComments", "showInNavigation", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StaticPageTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StaticPageTag" (id, "pageId", "tagId") FROM stdin;
\.


--
-- Data for Name: StaticPageTranslation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StaticPageTranslation" (id, "pageId", language, title, content, excerpt, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StreakRecord; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StreakRecord" (id, "userId", "currentStreak", "longestStreak", "lastActiveDate", "streakStartDate", "frozenDays") FROM stdin;
\.


--
-- Data for Name: StudentAnswer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StudentAnswer" (id, "userId", "questionId", answer, "isCorrect", "pointsEarned", "createdAt") FROM stdin;
\.


--
-- Data for Name: StudentQuizResult; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StudentQuizResult" (id, "userId", "quizId", "courseId", score, passed, "attemptNumber", "timeSpent", answers, "completedAt") FROM stdin;
\.


--
-- Data for Name: SystemSettings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SystemSettings" (id, key, value, description, "updatedAt") FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tag" (id, "nameUa", "nameEn", color, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Test; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Test" (id, title, description, category, difficulty, "timeLimit", "passingScore", "totalQuestions", "isPublished", "isAdaptive", instructions, "allowReview", "shuffleQuestions", "maxAttempts", tags, "createdAt", "updatedAt") FROM stdin;
cmd2zn0zz000fz16z6wfd5tnk	Тест з основ безпеки	Перевірте свої знання основних правил безпеки на мотоциклі	general	BEGINNER	10	80	10	f	f	\N	t	f	3	\N	2025-07-14 10:56:13.776	2025-07-14 10:56:13.776
cmdu5xn1r0000z177mjjo9afd	ФІНАЛЬНИЙ ТЕСТ РАЙДЕРА	{"originalDescription":"Комплексний тест для оцінки реального рівня навичок райдера","blocks":[{"id":"block-1","title":"ПРОФІЛЬ РАЙДЕРА","emoji":"[1]"},{"id":"block-2","title":"МІСЬКА СТРАТЕГІЯ","emoji":"[2]"},{"id":"block-3","title":"ТЕХНІКА ГАЛЬМУВАННЯ","emoji":"[3]"},{"id":"block-4","title":"МАНЕВРУВАННЯ","emoji":"[4]"},{"id":"block-5","title":"ЕКСТРЕМАЛЬНІ СИТУАЦІЇ","emoji":"[5]"}],"scoring":{"levels":[{"level":1,"range":[0,4],"title":"Level 1","description":"Не готовий до міста"},{"level":2,"range":[5,8],"title":"Level 2","description":"Початківець"},{"level":3,"range":[9,12],"title":"Level 3","description":"Небезпечна зона"},{"level":4,"range":[13,16],"title":"Level 4","description":"Базовий рівень безпеки"},{"level":5,"range":[17,20],"title":"Level 5-6","description":"Компетентний"},{"level":7,"range":[21,25],"title":"Level 7-8","description":"Дійсно досвідчений"}],"criticalQuestions":[7,10,14,15,22],"criticalPenalty":1},"metadata":{"totalQuestions":25,"estimatedTime":38,"difficulty":"INTERMEDIATE","category":"motorcycle-safety"}}	general	BEGINNER	38	60	10	f	f	\N	t	f	3	\N	2025-08-02 11:22:13.36	2025-08-02 11:22:13.408
cmdxjsv1b0000z1549bqlyog7	Тест оцінки компетенції мотоцикліста V1.0	Інтерактивна система оцінки компетенцій для мотоциклістів. 68 питань, 7 блоків компетенцій, персоналізовані рекомендації.	general	BEGINNER	30	60	10	f	f	\N	t	f	3	\N	2025-08-04 20:13:43.582	2025-08-04 20:13:43.582
cmdya56zl0000z19eessucgau	Тест оцінки компетенції мотоцикліста V1.0	Інтерактивна система оцінки компетенцій для мотоциклістів. 68 питань, 7 блоків компетенцій, персоналізовані рекомендації.	general	BEGINNER	30	60	10	f	f	\N	t	f	3	\N	2025-08-05 08:31:08.96	2025-08-05 08:31:08.96
cmdyrrlnp0000z1m90mn0wahp	Тест компетенцій мотоцикліста V2.0 (Адаптивний)	Адаптивний тест з 47 питань для оцінки компетенцій мотоциклістів. Включає психологічний профіль ПСКП.	general	BEGINNER	30	60	47	f	t	\N	t	f	3	\N	2025-08-05 16:44:27.877	2025-08-05 16:44:27.877
\.


--
-- Data for Name: TestAnswer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TestAnswer" (id, "sessionId", "questionId", "userId", answer, "isCorrect", "timeSpent", confidence, "createdAt") FROM stdin;
\.


--
-- Data for Name: TestQuestion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TestQuestion" (id, "testId", question, type, options, "correctAnswer", explanation, points, difficulty, "orderIndex", "imageUrl", "competencyArea", "subCompetency", metadata) FROM stdin;
\.


--
-- Data for Name: TestResult; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TestResult" (id, "sessionId", "userId", "testId", score, percentage, passed, "correctAnswers", "totalQuestions", "timeSpent", feedback, certificate, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: TestSession; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TestSession" (id, "testId", "userId", status, "startedAt", "completedAt", "timeSpent", "currentQuestionId", metadata) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, "emailVerified", password, name, image, role, phone, "dateOfBirth", "schoolId", "schoolGroupId", "stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus", "subscriptionTier", "subscriptionCurrentPeriodEnd", "createdAt", "updatedAt", "lastLoginAt", "defaultShippingAddress", "preferredShippingMethod", wishlist, "loyaltyPoints", "loyaltyTier", "deletedAt", "deletedBy", "deletionReason", "riderProfile", "riderProfileData") FROM stdin;
cm1234admin	admin@test.com	2025-08-21 13:35:44.645	$2a$12$U20hVUfOi1Po7La5mJfk1umbKnHA//QnGQ0cEysnSbnQsNXfbGQtC	Admin User	\N	ADMIN	\N	\N	\N	\N	\N	\N	\N	FREE	\N	2025-08-21 13:35:44.664	2025-08-21 13:35:44.664	\N	\N	\N	\N	0	bronze	\N	\N	\N	\N	\N
cm1234school	school@test.com	2025-08-21 13:35:44.645	$2a$12$U20hVUfOi1Po7La5mJfk1umbKnHA//QnGQ0cEysnSbnQsNXfbGQtC	School Admin	\N	SCHOOL_ADMIN	\N	\N	\N	\N	\N	\N	\N	FREE	\N	2025-08-21 13:35:44.674	2025-08-21 13:35:44.674	\N	\N	\N	\N	0	bronze	\N	\N	\N	\N	\N
cm1234instructor	instructor@test.com	2025-08-21 13:35:44.645	$2a$12$U20hVUfOi1Po7La5mJfk1umbKnHA//QnGQ0cEysnSbnQsNXfbGQtC	Test Instructor	\N	INSTRUCTOR	\N	\N	\N	\N	\N	\N	\N	FREE	\N	2025-08-21 13:35:44.676	2025-08-21 13:35:44.676	\N	\N	\N	\N	0	bronze	\N	\N	\N	\N	\N
cm1234superadmin	admin@nebachiv.com	2025-08-21 13:35:44.645	$2a$12$U20hVUfOi1Po7La5mJfk1umbKnHA//QnGQ0cEysnSbnQsNXfbGQtC	Super Admin	\N	ADMIN	\N	\N	\N	\N	\N	\N	\N	FREE	\N	2025-08-21 13:35:44.677	2025-08-21 13:35:44.677	\N	\N	\N	\N	0	bronze	\N	\N	\N	\N	\N
cm1234student2	student2@test.com	2025-08-21 13:35:44.645	$2a$12$U20hVUfOi1Po7La5mJfk1umbKnHA//QnGQ0cEysnSbnQsNXfbGQtC	Test Student 2	\N	STUDENT	\N	\N	\N	\N	\N	\N	\N	FREE	\N	2025-08-21 13:35:44.673	2025-08-21 16:38:07.196	2025-08-21 16:38:07.195	\N	\N	\N	0	bronze	\N	\N	\N	EXPERIENCED_RIDER	{"answers": {"mainGoal": "track days", "bikePower": "650cc", "experience": "2-5 years", "ridingStyle": "sport"}, "completedAt": "2025-08-21T15:28:58.419Z", "profileType": "EXPERIENCED_RIDER"}
cm1234student1	student@test.com	2025-08-21 13:35:44.645	$2a$12$U20hVUfOi1Po7La5mJfk1umbKnHA//QnGQ0cEysnSbnQsNXfbGQtC	Test Student	\N	STUDENT	\N	\N	\N	\N	\N	\N	\N	FREE	\N	2025-08-21 13:35:44.671	2025-08-21 16:40:02.904	2025-08-21 16:40:02.903	\N	\N	\N	0	bronze	\N	\N	\N	BEGINNER_CAUTIOUS	{"answers": {"mainGoal": "safety", "bikePower": "300cc", "experience": "less than 6 months", "ridingStyle": "commute"}, "completedAt": "2025-08-21T15:28:58.432Z", "profileType": "BEGINNER_CAUTIOUS"}
\.


--
-- Data for Name: UserAchievement; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserAchievement" (id, "userId", "achievementId", "unlockedAt", progress) FROM stdin;
\.


--
-- Data for Name: UserBadge; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserBadge" (id, "userId", "badgeId", "earnedAt") FROM stdin;
\.


--
-- Data for Name: UserFlow; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserFlow" (id, name, description, "createdBy", "isActive", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserFlowNode; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserFlowNode" (id, "flowId", "userId", "nodeName", completed, "timeSpent", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: UserMotorcycle; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserMotorcycle" (id, "userId", brand, model, year, "engineSize", "purchaseDate", "sellDate", "isCurrent", photos, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: UserSegment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserSegment" (id, "userId", "segmentName", "segmentValue", confidence, metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserSocialProfile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserSocialProfile" (id, "userId", platform, "profileUrl", username, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: Waitlist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Waitlist" (id, email, name, phone, interests, source, "createdAt") FROM stdin;
cmeliqq6y0000z1gwxppp7gub	test@example.com	\N	\N	{}	test	2025-08-21 14:50:32.602
cmelizh780001z1gw1d6xth75	final-test@example.com	\N	\N	{}	homepage_test	2025-08-21 14:57:20.852
\.


--
-- Data for Name: XPTransaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."XPTransaction" (id, "userId", amount, type, description, metadata, "createdAt") FROM stdin;
\.


--
-- Name: AIUsageLog AIUsageLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIUsageLog"
    ADD CONSTRAINT "AIUsageLog_pkey" PRIMARY KEY (id);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Achievement Achievement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY (id);


--
-- Name: AdaptiveTestResult AdaptiveTestResult_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdaptiveTestResult"
    ADD CONSTRAINT "AdaptiveTestResult_pkey" PRIMARY KEY (id);


--
-- Name: AdminSettings AdminSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdminSettings"
    ADD CONSTRAINT "AdminSettings_pkey" PRIMARY KEY (id);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: ArticleSuggestion ArticleSuggestion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleSuggestion"
    ADD CONSTRAINT "ArticleSuggestion_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Badge Badge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Badge"
    ADD CONSTRAINT "Badge_pkey" PRIMARY KEY (id);


--
-- Name: BatchAnalytic BatchAnalytic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BatchAnalytic"
    ADD CONSTRAINT "BatchAnalytic_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Certificate Certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: ContentEngagement ContentEngagement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentEngagement"
    ADD CONSTRAINT "ContentEngagement_pkey" PRIMARY KEY (id);


--
-- Name: ConversionFunnel ConversionFunnel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ConversionFunnel"
    ADD CONSTRAINT "ConversionFunnel_pkey" PRIMARY KEY (id);


--
-- Name: CourseReview CourseReview_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CourseReview"
    ADD CONSTRAINT "CourseReview_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: DailyActivity DailyActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DailyActivity"
    ADD CONSTRAINT "DailyActivity_pkey" PRIMARY KEY (id);


--
-- Name: DynamicContent DynamicContent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DynamicContent"
    ADD CONSTRAINT "DynamicContent_pkey" PRIMARY KEY (id);


--
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id);


--
-- Name: FeatureUsage FeatureUsage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeatureUsage"
    ADD CONSTRAINT "FeatureUsage_pkey" PRIMARY KEY (id);


--
-- Name: FeedbackSubmission FeedbackSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeedbackSubmission"
    ADD CONSTRAINT "FeedbackSubmission_pkey" PRIMARY KEY (id);


--
-- Name: KBNebContent KBNebContent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KBNebContent"
    ADD CONSTRAINT "KBNebContent_pkey" PRIMARY KEY (id);


--
-- Name: KBNebSyncLog KBNebSyncLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KBNebSyncLog"
    ADD CONSTRAINT "KBNebSyncLog_pkey" PRIMARY KEY (id);


--
-- Name: Leaderboard Leaderboard_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Leaderboard"
    ADD CONSTRAINT "Leaderboard_pkey" PRIMARY KEY (id);


--
-- Name: LessonPageTemplate LessonPageTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonPageTemplate"
    ADD CONSTRAINT "LessonPageTemplate_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: Module Module_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "Module_pkey" PRIMARY KEY (id);


--
-- Name: Motorcycle Motorcycle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Motorcycle"
    ADD CONSTRAINT "Motorcycle_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: PageEngagement PageEngagement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PageEngagement"
    ADD CONSTRAINT "PageEngagement_pkey" PRIMARY KEY (id);


--
-- Name: PageTemplate PageTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PageTemplate"
    ADD CONSTRAINT "PageTemplate_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PracticeAttempt PracticeAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PracticeAttempt"
    ADD CONSTRAINT "PracticeAttempt_pkey" PRIMARY KEY (id);


--
-- Name: ProductPurchase ProductPurchase_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductPurchase"
    ADD CONSTRAINT "ProductPurchase_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Progress Progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_pkey" PRIMARY KEY (id);


--
-- Name: QuestionnaireProfile QuestionnaireProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionnaireProfile"
    ADD CONSTRAINT "QuestionnaireProfile_pkey" PRIMARY KEY (id);


--
-- Name: QuizQuestion QuizQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY (id);


--
-- Name: Quiz Quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY (id);


--
-- Name: RealtimeMetric RealtimeMetric_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RealtimeMetric"
    ADD CONSTRAINT "RealtimeMetric_pkey" PRIMARY KEY (id);


--
-- Name: Referral Referral_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_pkey" PRIMARY KEY (id);


--
-- Name: RiderEvent RiderEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RiderEvent"
    ADD CONSTRAINT "RiderEvent_pkey" PRIMARY KEY (id);


--
-- Name: RiderSkillMap RiderSkillMap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RiderSkillMap"
    ADD CONSTRAINT "RiderSkillMap_pkey" PRIMARY KEY (id);


--
-- Name: RiderSkills RiderSkills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RiderSkills"
    ADD CONSTRAINT "RiderSkills_pkey" PRIMARY KEY (id);


--
-- Name: RiderTimelineEvent RiderTimelineEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RiderTimelineEvent"
    ADD CONSTRAINT "RiderTimelineEvent_pkey" PRIMARY KEY (id);


--
-- Name: SavedFilter SavedFilter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SavedFilter"
    ADD CONSTRAINT "SavedFilter_pkey" PRIMARY KEY (id);


--
-- Name: SchoolGroup SchoolGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SchoolGroup"
    ADD CONSTRAINT "SchoolGroup_pkey" PRIMARY KEY (id);


--
-- Name: SchoolInstructor SchoolInstructor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SchoolInstructor"
    ADD CONSTRAINT "SchoolInstructor_pkey" PRIMARY KEY (id);


--
-- Name: School School_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_pkey" PRIMARY KEY (id);


--
-- Name: SessionBehavior SessionBehavior_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SessionBehavior"
    ADD CONSTRAINT "SessionBehavior_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: ShippingAddress ShippingAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ShippingAddress"
    ADD CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY (id);


--
-- Name: StaticPageTag StaticPageTag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StaticPageTag"
    ADD CONSTRAINT "StaticPageTag_pkey" PRIMARY KEY (id);


--
-- Name: StaticPageTranslation StaticPageTranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StaticPageTranslation"
    ADD CONSTRAINT "StaticPageTranslation_pkey" PRIMARY KEY (id);


--
-- Name: StaticPage StaticPage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StaticPage"
    ADD CONSTRAINT "StaticPage_pkey" PRIMARY KEY (id);


--
-- Name: StreakRecord StreakRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StreakRecord"
    ADD CONSTRAINT "StreakRecord_pkey" PRIMARY KEY (id);


--
-- Name: StudentAnswer StudentAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentAnswer"
    ADD CONSTRAINT "StudentAnswer_pkey" PRIMARY KEY (id);


--
-- Name: StudentQuizResult StudentQuizResult_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentQuizResult"
    ADD CONSTRAINT "StudentQuizResult_pkey" PRIMARY KEY (id);


--
-- Name: SystemSettings SystemSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: TestAnswer TestAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestAnswer"
    ADD CONSTRAINT "TestAnswer_pkey" PRIMARY KEY (id);


--
-- Name: TestQuestion TestQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestQuestion"
    ADD CONSTRAINT "TestQuestion_pkey" PRIMARY KEY (id);


--
-- Name: TestResult TestResult_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestResult"
    ADD CONSTRAINT "TestResult_pkey" PRIMARY KEY (id);


--
-- Name: TestSession TestSession_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestSession"
    ADD CONSTRAINT "TestSession_pkey" PRIMARY KEY (id);


--
-- Name: Test Test_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Test"
    ADD CONSTRAINT "Test_pkey" PRIMARY KEY (id);


--
-- Name: UserAchievement UserAchievement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_pkey" PRIMARY KEY (id);


--
-- Name: UserBadge UserBadge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_pkey" PRIMARY KEY (id);


--
-- Name: UserFlowNode UserFlowNode_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserFlowNode"
    ADD CONSTRAINT "UserFlowNode_pkey" PRIMARY KEY (id);


--
-- Name: UserFlow UserFlow_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserFlow"
    ADD CONSTRAINT "UserFlow_pkey" PRIMARY KEY (id);


--
-- Name: UserMotorcycle UserMotorcycle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserMotorcycle"
    ADD CONSTRAINT "UserMotorcycle_pkey" PRIMARY KEY (id);


--
-- Name: UserSegment UserSegment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserSegment"
    ADD CONSTRAINT "UserSegment_pkey" PRIMARY KEY (id);


--
-- Name: UserSocialProfile UserSocialProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserSocialProfile"
    ADD CONSTRAINT "UserSocialProfile_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Waitlist Waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Waitlist"
    ADD CONSTRAINT "Waitlist_pkey" PRIMARY KEY (id);


--
-- Name: XPTransaction XPTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."XPTransaction"
    ADD CONSTRAINT "XPTransaction_pkey" PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Achievement_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Achievement_name_key" ON public."Achievement" USING btree (name);


--
-- Name: AdminSettings_userId_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AdminSettings_userId_key_key" ON public."AdminSettings" USING btree ("userId", key);


--
-- Name: Badge_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Badge_name_key" ON public."Badge" USING btree (name);


--
-- Name: CartItem_cartId_productId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON public."CartItem" USING btree ("cartId", "productId");


--
-- Name: Cart_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Cart_userId_key" ON public."Cart" USING btree ("userId");


--
-- Name: Certificate_certificateNo_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Certificate_certificateNo_key" ON public."Certificate" USING btree ("certificateNo");


--
-- Name: Certificate_userId_courseId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON public."Certificate" USING btree ("userId", "courseId");


--
-- Name: CourseReview_userId_courseId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CourseReview_userId_courseId_key" ON public."CourseReview" USING btree ("userId", "courseId");


--
-- Name: Course_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Course_slug_key" ON public."Course" USING btree (slug);


--
-- Name: DailyActivity_userId_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "DailyActivity_userId_date_key" ON public."DailyActivity" USING btree ("userId", date);


--
-- Name: Enrollment_userId_courseId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON public."Enrollment" USING btree ("userId", "courseId");


--
-- Name: Leaderboard_userId_period_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Leaderboard_userId_period_key" ON public."Leaderboard" USING btree ("userId", period);


--
-- Name: Lesson_moduleId_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Lesson_moduleId_slug_key" ON public."Lesson" USING btree ("moduleId", slug);


--
-- Name: Motorcycle_beginnerFriendly_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Motorcycle_beginnerFriendly_idx" ON public."Motorcycle" USING btree ("beginnerFriendly");


--
-- Name: Motorcycle_brand_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Motorcycle_brand_idx" ON public."Motorcycle" USING btree (brand);


--
-- Name: Motorcycle_fullName_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Motorcycle_fullName_idx" ON public."Motorcycle" USING btree ("fullName");


--
-- Name: Motorcycle_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Motorcycle_type_idx" ON public."Motorcycle" USING btree (type);


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: PageTemplate_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PageTemplate_slug_key" ON public."PageTemplate" USING btree (slug);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Progress_userId_lessonId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON public."Progress" USING btree ("userId", "lessonId");


--
-- Name: QuestionnaireProfile_profileType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "QuestionnaireProfile_profileType_idx" ON public."QuestionnaireProfile" USING btree ("profileType");


--
-- Name: QuestionnaireProfile_riskProfile_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "QuestionnaireProfile_riskProfile_idx" ON public."QuestionnaireProfile" USING btree ("riskProfile");


--
-- Name: QuestionnaireProfile_testResultId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "QuestionnaireProfile_testResultId_key" ON public."QuestionnaireProfile" USING btree ("testResultId");


--
-- Name: QuestionnaireProfile_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "QuestionnaireProfile_type_idx" ON public."QuestionnaireProfile" USING btree (type);


--
-- Name: QuestionnaireProfile_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "QuestionnaireProfile_userId_idx" ON public."QuestionnaireProfile" USING btree ("userId");


--
-- Name: Referral_referredUserId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Referral_referredUserId_key" ON public."Referral" USING btree ("referredUserId");


--
-- Name: RiderEvent_riderSkillsId_eventId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "RiderEvent_riderSkillsId_eventId_key" ON public."RiderEvent" USING btree ("riderSkillsId", "eventId");


--
-- Name: RiderSkillMap_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "RiderSkillMap_userId_key" ON public."RiderSkillMap" USING btree ("userId");


--
-- Name: RiderSkills_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "RiderSkills_userId_key" ON public."RiderSkills" USING btree ("userId");


--
-- Name: RiderTimelineEvent_eventType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "RiderTimelineEvent_eventType_idx" ON public."RiderTimelineEvent" USING btree ("eventType");


--
-- Name: RiderTimelineEvent_userId_eventDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "RiderTimelineEvent_userId_eventDate_idx" ON public."RiderTimelineEvent" USING btree ("userId", "eventDate");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: StaticPageTag_pageId_tagId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "StaticPageTag_pageId_tagId_key" ON public."StaticPageTag" USING btree ("pageId", "tagId");


--
-- Name: StaticPageTranslation_pageId_language_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "StaticPageTranslation_pageId_language_key" ON public."StaticPageTranslation" USING btree ("pageId", language);


--
-- Name: StaticPage_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "StaticPage_slug_key" ON public."StaticPage" USING btree (slug);


--
-- Name: StreakRecord_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "StreakRecord_userId_key" ON public."StreakRecord" USING btree ("userId");


--
-- Name: SystemSettings_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "SystemSettings_key_key" ON public."SystemSettings" USING btree (key);


--
-- Name: Tag_nameUa_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tag_nameUa_key" ON public."Tag" USING btree ("nameUa");


--
-- Name: TestResult_sessionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TestResult_sessionId_key" ON public."TestResult" USING btree ("sessionId");


--
-- Name: UserAchievement_userId_achievementId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON public."UserAchievement" USING btree ("userId", "achievementId");


--
-- Name: UserBadge_userId_badgeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON public."UserBadge" USING btree ("userId", "badgeId");


--
-- Name: UserMotorcycle_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "UserMotorcycle_userId_idx" ON public."UserMotorcycle" USING btree ("userId");


--
-- Name: UserSocialProfile_userId_platform_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UserSocialProfile_userId_platform_key" ON public."UserSocialProfile" USING btree ("userId", platform);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_stripeSubscriptionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON public."User" USING btree ("stripeSubscriptionId");


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Waitlist_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Waitlist_email_idx" ON public."Waitlist" USING btree (email);


--
-- Name: Waitlist_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Waitlist_email_key" ON public."Waitlist" USING btree (email);


--
-- Name: Waitlist_source_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Waitlist_source_idx" ON public."Waitlist" USING btree (source);


--
-- Name: AIUsageLog AIUsageLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIUsageLog"
    ADD CONSTRAINT "AIUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AdaptiveTestResult AdaptiveTestResult_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdaptiveTestResult"
    ADD CONSTRAINT "AdaptiveTestResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."TestSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AdaptiveTestResult AdaptiveTestResult_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdaptiveTestResult"
    ADD CONSTRAINT "AdaptiveTestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AdaptiveTestResult AdaptiveTestResult_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdaptiveTestResult"
    ADD CONSTRAINT "AdaptiveTestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AdminSettings AdminSettings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdminSettings"
    ADD CONSTRAINT "AdminSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcement Announcement_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcement Announcement_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleSuggestion ArticleSuggestion_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleSuggestion"
    ADD CONSTRAINT "ArticleSuggestion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ArticleSuggestion ArticleSuggestion_kbNebId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ArticleSuggestion"
    ADD CONSTRAINT "ArticleSuggestion_kbNebId_fkey" FOREIGN KEY ("kbNebId") REFERENCES public."KBNebContent"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BatchAnalytic BatchAnalytic_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BatchAnalytic"
    ADD CONSTRAINT "BatchAnalytic_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certificate Certificate_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certificate Certificate_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ContentEngagement ContentEngagement_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentEngagement"
    ADD CONSTRAINT "ContentEngagement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ConversionFunnel ConversionFunnel_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ConversionFunnel"
    ADD CONSTRAINT "ConversionFunnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CourseReview CourseReview_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CourseReview"
    ADD CONSTRAINT "CourseReview_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseReview CourseReview_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CourseReview"
    ADD CONSTRAINT "CourseReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Course Course_instructorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Course Course_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DailyActivity DailyActivity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DailyActivity"
    ADD CONSTRAINT "DailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DynamicContent DynamicContent_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DynamicContent"
    ADD CONSTRAINT "DynamicContent_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Enrollment Enrollment_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Enrollment Enrollment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeatureUsage FeatureUsage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeatureUsage"
    ADD CONSTRAINT "FeatureUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FeedbackSubmission FeedbackSubmission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeedbackSubmission"
    ADD CONSTRAINT "FeedbackSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: KBNebSyncLog KBNebSyncLog_contentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KBNebSyncLog"
    ADD CONSTRAINT "KBNebSyncLog_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES public."KBNebContent"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Leaderboard Leaderboard_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Leaderboard"
    ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonPageTemplate LessonPageTemplate_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonPageTemplate"
    ADD CONSTRAINT "LessonPageTemplate_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonPageTemplate LessonPageTemplate_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonPageTemplate"
    ADD CONSTRAINT "LessonPageTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."PageTemplate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Module Module_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PageEngagement PageEngagement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PageEngagement"
    ADD CONSTRAINT "PageEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PageTemplate PageTemplate_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PageTemplate"
    ADD CONSTRAINT "PageTemplate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PracticeAttempt PracticeAttempt_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PracticeAttempt"
    ADD CONSTRAINT "PracticeAttempt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PracticeAttempt PracticeAttempt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PracticeAttempt"
    ADD CONSTRAINT "PracticeAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductPurchase ProductPurchase_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductPurchase"
    ADD CONSTRAINT "ProductPurchase_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductPurchase ProductPurchase_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductPurchase"
    ADD CONSTRAINT "ProductPurchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductPurchase ProductPurchase_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductPurchase"
    ADD CONSTRAINT "ProductPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Progress Progress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Progress Progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuestionnaireProfile QuestionnaireProfile_testResultId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionnaireProfile"
    ADD CONSTRAINT "QuestionnaireProfile_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES public."TestResult"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuestionnaireProfile QuestionnaireProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionnaireProfile"
    ADD CONSTRAINT "QuestionnaireProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizQuestion QuizQuestion_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quiz Quiz_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RealtimeMetric RealtimeMetric_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RealtimeMetric"
    ADD CONSTRAINT "RealtimeMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Referral Referral_referredUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Referral Referral_referrerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RiderEvent RiderEvent_riderSkillsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RiderEvent"
    ADD CONSTRAINT "RiderEvent_riderSkillsId_fkey" FOREIGN KEY ("riderSkillsId") REFERENCES public."RiderSkills"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RiderSkillMap RiderSkillMap_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RiderSkillMap"
    ADD CONSTRAINT "RiderSkillMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RiderSkills RiderSkills_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RiderSkills"
    ADD CONSTRAINT "RiderSkills_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RiderTimelineEvent RiderTimelineEvent_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RiderTimelineEvent"
    ADD CONSTRAINT "RiderTimelineEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SavedFilter SavedFilter_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SavedFilter"
    ADD CONSTRAINT "SavedFilter_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolGroup SchoolGroup_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SchoolGroup"
    ADD CONSTRAINT "SchoolGroup_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolInstructor SchoolInstructor_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SchoolInstructor"
    ADD CONSTRAINT "SchoolInstructor_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SessionBehavior SessionBehavior_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SessionBehavior"
    ADD CONSTRAINT "SessionBehavior_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ShippingAddress ShippingAddress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ShippingAddress"
    ADD CONSTRAINT "ShippingAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaticPageTag StaticPageTag_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StaticPageTag"
    ADD CONSTRAINT "StaticPageTag_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."StaticPage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaticPageTag StaticPageTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StaticPageTag"
    ADD CONSTRAINT "StaticPageTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaticPageTranslation StaticPageTranslation_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StaticPageTranslation"
    ADD CONSTRAINT "StaticPageTranslation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."StaticPage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaticPage StaticPage_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StaticPage"
    ADD CONSTRAINT "StaticPage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."StaticPage"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StreakRecord StreakRecord_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StreakRecord"
    ADD CONSTRAINT "StreakRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentAnswer StudentAnswer_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentAnswer"
    ADD CONSTRAINT "StudentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."QuizQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentQuizResult StudentQuizResult_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentQuizResult"
    ADD CONSTRAINT "StudentQuizResult_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentQuizResult StudentQuizResult_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentQuizResult"
    ADD CONSTRAINT "StudentQuizResult_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestAnswer TestAnswer_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestAnswer"
    ADD CONSTRAINT "TestAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."TestQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestAnswer TestAnswer_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestAnswer"
    ADD CONSTRAINT "TestAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."TestSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestAnswer TestAnswer_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestAnswer"
    ADD CONSTRAINT "TestAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestQuestion TestQuestion_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestQuestion"
    ADD CONSTRAINT "TestQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestResult TestResult_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestResult"
    ADD CONSTRAINT "TestResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."TestSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestResult TestResult_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestResult"
    ADD CONSTRAINT "TestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestResult TestResult_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestResult"
    ADD CONSTRAINT "TestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestSession TestSession_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestSession"
    ADD CONSTRAINT "TestSession_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestSession TestSession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TestSession"
    ADD CONSTRAINT "TestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserAchievement UserAchievement_achievementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES public."Achievement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserAchievement UserAchievement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserBadge UserBadge_badgeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES public."Badge"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserBadge UserBadge_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserBadge"
    ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserFlowNode UserFlowNode_flowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserFlowNode"
    ADD CONSTRAINT "UserFlowNode_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES public."UserFlow"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserFlowNode UserFlowNode_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserFlowNode"
    ADD CONSTRAINT "UserFlowNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserFlow UserFlow_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserFlow"
    ADD CONSTRAINT "UserFlow_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserMotorcycle UserMotorcycle_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserMotorcycle"
    ADD CONSTRAINT "UserMotorcycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSegment UserSegment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserSegment"
    ADD CONSTRAINT "UserSegment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSocialProfile UserSocialProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserSocialProfile"
    ADD CONSTRAINT "UserSocialProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_schoolGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_schoolGroupId_fkey" FOREIGN KEY ("schoolGroupId") REFERENCES public."SchoolGroup"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: XPTransaction XPTransaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."XPTransaction"
    ADD CONSTRAINT "XPTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

