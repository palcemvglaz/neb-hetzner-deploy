PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "PasswordReset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "School" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "settings" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "deletionReason" TEXT
);
INSERT INTO School VALUES('cmd2zn03d0001z16zu03uq0uq','Демо Мотошкола','demo-motoshkola','Демонстраційна мотошкола для тестування системи',NULL,NULL,'+380671234567','info@demo-motoshkola.com','вул. Хрещатик, 1, Київ',1,NULL,1752490572601,1752490572601,NULL,NULL,NULL);
INSERT INTO School VALUES('cmdkq3p9s0002z1e2oip6c798','Test Driving School','test-school','A test driving school for role testing',NULL,NULL,'+380123456789','school@test.com',NULL,1,NULL,1753562946736,1753562946736,NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS "SchoolGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "maxStudents" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SchoolGroup_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kbNebId" TEXT,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contentType" TEXT,
    "format" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockRequirements" TEXT,
    "difficultyLevel" TEXT,
    "videoUrl" TEXT,
    "audioUrl" TEXT,
    "thumbnailUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "order" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "estimatedTime" INTEGER,
    "kbNebMetadata" TEXT,
    "qualityScores" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "deletionReason" TEXT
);
INSERT INTO Content VALUES('cmd2zn0zy000dz16zxdvudr0h',NULL,'osnovni-pravyla-bezpeki','GUIDE',NULL,NULL,'PUBLISHED',0,NULL,NULL,NULL,NULL,NULL,1,0,NULL,1,'BEGINNER',15,NULL,NULL,1752490573775,1752490573775,NULL,NULL,NULL);
INSERT INTO Content VALUES('cmd2zn1090019z16zx15fn2ql',NULL,'safety-basics-light','LESSON','TEXT',NULL,'PUBLISHED',0,NULL,'LIGHT',NULL,NULL,NULL,1,0,NULL,0,'BEGINNER',10,NULL,NULL,1752490573785,1752490573785,NULL,NULL,NULL);
INSERT INTO Content VALUES('cmd2zn109001az16zuxwt0g4t',NULL,'safety-basics-medium','LESSON','TEXT',NULL,'PUBLISHED',0,NULL,'MEDIUM',NULL,NULL,NULL,1,0,NULL,0,'INTERMEDIATE',25,NULL,NULL,1752490573785,1752490573785,NULL,NULL,NULL);
INSERT INTO Content VALUES('cmd2zn109001cz16zdiln7ri2',NULL,'case-study-intersection','CASE_STUDY','VIDEO',NULL,'PUBLISHED',0,NULL,NULL,'https://example.com/case-study-1.mp4',NULL,'https://example.com/case-study-1-thumb.jpg',1,0,NULL,0,'INTERMEDIATE',15,NULL,NULL,1752490573785,1752490573785,NULL,NULL,NULL);
INSERT INTO Content VALUES('cmd2zn109001lz16zmhgynjaw',NULL,'safety-basics-hard','LESSON','TEXT',NULL,'PUBLISHED',1,'{"type":"TEST_SCORE","testId":"cmd2zn0zz000fz16z6wfd5tnk","minScore":90,"description":"Отримати 90% на тесті з основ безпеки"}','HARD',NULL,NULL,NULL,1,0,NULL,0,'ADVANCED',40,NULL,NULL,1752490573785,1752490573785,NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS "ContentTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "body" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    CONSTRAINT "ContentTranslation_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO ContentTranslation VALUES('cmd2zn0zy000ez16zbkkby0oa','cmd2zn0zy000dz16zxdvudr0h','UA','Основні правила безпеки на мотоциклі','Базові правила безпеки, які повинен знати кожен мотоцикліст',replace('# Основні правила безпеки на мотоциклі\n\n## Екіпіровка\n\n1. **Шолом** - обов''язковий елемент безпеки\n2. **Захисний одяг** - куртка, штани, рукавички\n3. **Взуття** - закрите взуття з твердою підошвою\n\n## Перед поїздкою\n\n- Перевірте технічний стан мотоцикла\n- Переконайтеся у справності гальм\n- Перевірте тиск у шинах\n\n## На дорозі\n\n- Дотримуйтесь швидкісного режиму\n- Тримайте безпечну дистанцію\n- Будьте помітними для інших учасників руху','\n',char(10)),'Основні правила безпеки на мотоциклі | Nebachiv','Дізнайтеся про основні правила безпеки для мотоциклістів. Екіпіровка, підготовка до поїздки та поведінка на дорозі.');
INSERT INTO ContentTranslation VALUES('cmd2zn109001bz16zg2192eoj','cmd2zn1090019z16zx15fn2ql','UA','Основи безпеки - Легкий рівень','Швидкий огляд основних концептів',replace('# Основи безпеки мотоцикліста\n\nКороткий огляд ключових принципів...','\n',char(10)),NULL,NULL);
INSERT INTO ContentTranslation VALUES('cmd2zn109001dz16z7jsckdmu','cmd2zn109001az16zuxwt0g4t','UA','Основи безпеки - Середній рівень','Детальний розбір з прикладами',replace('# Основи безпеки мотоцикліста\n\nДетальний аналіз кожного принципу...','\n',char(10)),NULL,NULL);
INSERT INTO ContentTranslation VALUES('cmd2zn109001gz16ztirkh9gk','cmd2zn109001cz16zdiln7ri2','UA','Розбір: Небезпечний перехрестя','Аналіз реальної ситуації на перехресті',replace('# Розбір ДТП на перехресті\n\nДетальний аналіз що пішло не так...','\n',char(10)),NULL,NULL);
INSERT INTO ContentTranslation VALUES('cmd2zn109001mz16zx07xfz8z','cmd2zn109001lz16zmhgynjaw','UA','Основи безпеки - Складний рівень','Поглиблене вивчення з практичними завданнями',replace('# Основи безпеки мотоцикліста - Експертний рівень\n\nСкладні сценарії та аналіз...','\n',char(10)),NULL,NULL);
CREATE TABLE IF NOT EXISTS "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameUa" TEXT NOT NULL,
    "nameEn" TEXT,
    "nameRu" TEXT,
    "color" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Tag VALUES('cmd2zn0zt000az16z4f6n6es4','bezpeka','Безпека','Safety','Безопасность',NULL,NULL,1752490573769,1752490573769);
INSERT INTO Tag VALUES('cmd2zn0zt000bz16z0lgqawsv','pdr','ПДР','Traffic Rules','ПДД',NULL,NULL,1752490573769,1752490573769);
INSERT INTO Tag VALUES('cmd2zn0zt000cz16zvfrzq1sn','tekhnika-vodinnya','Техніка водіння','Driving Technique','Техника вождения',NULL,NULL,1752490573769,1752490573769);
CREATE TABLE IF NOT EXISTS "ContentTag" (
    "contentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("contentId", "tagId"),
    CONSTRAINT "ContentTag_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO ContentTag VALUES('cmd2zn0zy000dz16zxdvudr0h','cmd2zn0zt000az16z4f6n6es4');
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Category VALUES('cmd2zn105000zz16zq05epj13','safety-basics','🛡️',1,1752490573782,1752490573782);
INSERT INTO Category VALUES('cmdmsx0g60000z13r8pewvy7o','road-safety',NULL,2,1753688605831,1753688605831);
INSERT INTO Category VALUES('cmdmsx0g80003z13rlbvf9ulk','maintenance',NULL,3,1753688605832,1753688605832);
INSERT INTO Category VALUES('cmdmsx0g90006z13rrqx60c86','advanced-techniques',NULL,4,1753688605833,1753688605833);
CREATE TABLE IF NOT EXISTS "CategoryTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO CategoryTranslation VALUES('cmd2zn1050010z16zvwww63lh','cmd2zn105000zz16zq05epj13','UA','Основи безпеки','Базові принципи безпечного керування мотоциклом');
INSERT INTO CategoryTranslation VALUES('cmdmsx0g60001z13r26r6bwu5','cmdmsx0g60000z13r8pewvy7o','UA','Безпека на дорозі','Правила та техніки безпечного водіння');
INSERT INTO CategoryTranslation VALUES('cmdmsx0g60002z13rkn2hgvo6','cmdmsx0g60000z13r8pewvy7o','EN','Road Safety','Rules and techniques for safe riding');
INSERT INTO CategoryTranslation VALUES('cmdmsx0g80004z13rgnonalxp','cmdmsx0g80003z13rlbvf9ulk','UA','Обслуговування','Догляд та ремонт мотоцикла');
INSERT INTO CategoryTranslation VALUES('cmdmsx0g80005z13r80cfquqf','cmdmsx0g80003z13rlbvf9ulk','EN','Maintenance','Motorcycle care and repair');
INSERT INTO CategoryTranslation VALUES('cmdmsx0g90007z13r1dy9yrqj','cmdmsx0g90006z13rrqx60c86','UA','Просунуті техніки','Складні прийоми водіння');
INSERT INTO CategoryTranslation VALUES('cmdmsx0g90008z13rghjm01hf','cmdmsx0g90006z13rrqx60c86','EN','Advanced Techniques','Advanced riding techniques');
CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "price" REAL NOT NULL DEFAULT 0,
    "categoryId" TEXT,
    "instructorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "deletionReason" TEXT,
    CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO Course VALUES('cmd2zn1060011z16zt3h3d1np','8-concepts-safety','BEGINNER',0,1,0.0,'cmd2zn105000zz16zq05epj13','cmd2zn03b0000z16zz3riko5y',1752490573783,1752490573783,NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS "CourseTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "learningOutcomes" TEXT,
    "requirements" TEXT,
    CONSTRAINT "CourseTranslation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO CourseTranslation VALUES('cmd2zn1060012z16zl3137ggg','cmd2zn1060011z16zt3h3d1np','UA','8 концептів безпеки мотоцикліста','Базовий курс з основними принципами безпечного керування мотоциклом','["Розуміння основних концептів безпеки","Вміння передбачати небезпеку","Правильне позиціювання на дорозі"]',NULL);
CREATE TABLE IF NOT EXISTS "CourseSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockRequirements" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO CourseSection VALUES('cmd2zn1070014z16zg6vdy6m0','cmd2zn1060011z16zt3h3d1np','Основи безпеки','Базові принципи безпечного керування',1,0,NULL,1752490573784,1752490573784);
INSERT INTO CourseSection VALUES('cmd2zn1080016z16zy21qo20t','cmd2zn1060011z16zt3h3d1np','Vision & Blocker','Концепція видимості та блокерів',2,1,'{"type":"AND","requirements":[{"type":"CONTENT_COMPLETE","count":1,"description":"Завершити першу тему"}]}',1752490573784,1752490573784);
INSERT INTO CourseSection VALUES('cmd2zn1080018z16ze1ijj2yw','cmd2zn1060011z16zt3h3d1np','Повороти та маневри','Техніка безпечних поворотів',3,1,'{"type":"OR","requirements":[{"type":"ACHIEVEMENT","code":"five_topics_complete","description":"Отримати досягнення \"П''ять тем\""},{"type":"PAYMENT","productId":"premium_access","description":"Преміум доступ"}]}',1752490573785,1752490573785);
CREATE TABLE IF NOT EXISTS "CourseSectionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "CourseSectionItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CourseSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseSectionItem_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO CourseSectionItem VALUES('cmd2zn109001hz16z0hmx5p56','cmd2zn1070014z16zg6vdy6m0','cmd2zn1090019z16zx15fn2ql',1,1);
INSERT INTO CourseSectionItem VALUES('cmd2zn109001iz16zsnrwi27y','cmd2zn1070014z16zg6vdy6m0','cmd2zn109001az16zuxwt0g4t',2,0);
INSERT INTO CourseSectionItem VALUES('cmd2zn109001kz16za1u5y0rg','cmd2zn1070014z16zg6vdy6m0','cmd2zn109001cz16zdiln7ri2',4,0);
INSERT INTO CourseSectionItem VALUES('cmd2zn109001oz16zv6ppvpes','cmd2zn1070014z16zg6vdy6m0','cmd2zn109001lz16zmhgynjaw',3,0);
CREATE TABLE IF NOT EXISTS "Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "certificateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "CourseReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseReview_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "UserAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 100,
    CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO UserAchievement VALUES('cmd2zn10l001sz16zz2lfsgoz','cmd2zn0gg0005z16z4m78um6c','cmd2zn101000sz16zlbbtz8vv','Перша тема','Завершіть вашу першу тему','LEARNING',1752490573798,100);
CREATE TABLE IF NOT EXISTS "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Answer VALUES('cmd2zn100000hz16zqsues541','cmd2zn100000gz16zjpycvhbe','Шолом',1,1,NULL);
INSERT INTO Answer VALUES('cmd2zn100000iz16zcrre9ote','cmd2zn100000gz16zjpycvhbe','Рукавички',0,2,NULL);
INSERT INTO Answer VALUES('cmd2zn100000jz16zto4rorw2','cmd2zn100000gz16zjpycvhbe','Куртка',0,3,NULL);
INSERT INTO Answer VALUES('cmd2zn100000kz16zdntljatx','cmd2zn100000gz16zjpycvhbe','Черевики',0,4,NULL);
INSERT INTO Answer VALUES('cmd2zn100000mz16zh83qbvez','cmd2zn100000lz16zqtq40jl5','Мінімальну',0,1,NULL);
INSERT INTO Answer VALUES('cmd2zn100000nz16zfmmzzo7z','cmd2zn100000lz16zqtq40jl5','Безпечну',1,2,NULL);
INSERT INTO Answer VALUES('cmd2zn100000oz16zgl95xbjc','cmd2zn100000lz16zqtq40jl5','Будь-яку',0,3,NULL);
INSERT INTO Answer VALUES('cmd2zn100000pz16zhhsft1s1','cmd2zn100000lz16zqtq40jl5','Максимальну',0,4,NULL);
INSERT INTO Answer VALUES('cmdu5xn1v0004z177psbqyvw2','cmdu5xn1u0002z177wql1g72n','1-3 (Початківець)',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn1v0006z1776ajn68b7','cmdu5xn1u0002z177wql1g72n','4-6 (Середній)',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn1w0008z17791w3pijp','cmdu5xn1u0002z177wql1g72n','7-8 (Досвідчений)',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn1w000az1771tol3ck5','cmdu5xn1u0002z177wql1g72n','9-10 (Експерт)',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn1x000ez177i3se3fee','cmdu5xn1x000cz177voix6siu','Перший сезон',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn1y000gz177rye4e8at','cmdu5xn1x000cz177voix6siu','2-3 сезони',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn1y000iz177kioghd4m','cmdu5xn1x000cz177voix6siu','4-7 сезонів',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn1y000kz177dwf5onp9','cmdu5xn1x000cz177voix6siu','Більше 7 сезонів',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn1z000oz177j30dbjmv','cmdu5xn1z000mz177wybipm7f','Не думав, просто почав',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn1z000qz177oh4vkqcj','cmdu5xn1z000mz177wybipm7f','Почитав форуми/поради',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn20000sz177ny6uwbib','cmdu5xn1z000mz177wybipm7f','Дивився відео аварій і аналізував',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn20000uz177dkp8b6km','cmdu5xn1z000mz177wybipm7f','Пройшов курси + вивчав матеріали',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn21000yz177groflzyo','cmdu5xn21000wz177zo642sfk','0-10',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn210010z177xj1xle5m','cmdu5xn21000wz177zo642sfk','10-50',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn220012z1774obgfjin','cmdu5xn21000wz177zo642sfk','50-100',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn220014z177f4oqdwva','cmdu5xn21000wz177zo642sfk','100+',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn220016z177ir1i11a8','cmdu5xn21000wz177zo642sfk','Не дивлюсь, це лякає',0,4,NULL);
INSERT INTO Answer VALUES('cmdu5xn23001az177e64ulvce','cmdu5xn230018z1777ksa2r4g','Ні, все гладко',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn24001cz17782tts82y','cmdu5xn230018z1777ksa2r4g','Втрата рівноваги на малій швидкості',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn24001ez177aua7dvz6','cmdu5xn230018z1777ksa2r4g','Мало не збили/врізався',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn24001gz177163wwv4f','cmdu5xn230018z1777ksa2r4g','Падіння на швидкості',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn25001iz177zon7tzd6','cmdu5xn230018z1777ksa2r4g','Заніс/втрата зчеплення',0,4,NULL);
INSERT INTO Answer VALUES('cmdu5xn25001mz177qk4kmx2m','cmdu5xn25001kz1773yexwey3','Розворот на вузькій дорозі',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn26001oz177rboiw0tc','cmdu5xn25001kz1773yexwey3','Гальмування в дощ',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn26001qz177arpb8ovc','cmdu5xn25001kz1773yexwey3','Міжряддя',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn26001sz177wmbsguqs','cmdu5xn25001kz1773yexwey3','Швидкі повороти',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn26001uz1776eqkkj6s','cmdu5xn25001kz1773yexwey3','Вантажівки поруч',0,4,NULL);
INSERT INTO Answer VALUES('cmdu5xn27001yz177iaga0n1l','cmdu5xn27001wz177c73w1pzg','В будь-який ряд між машинами',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn270020z177nit2woq9','cmdu5xn27001wz177c73w1pzg','По центру за машиною',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn280022z177s0pmhcik','cmdu5xn27001wz177c73w1pzg','Збоку крайньої машини (LLPP)',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn280024z177l5gauwi7','cmdu5xn27001wz177c73w1pzg','Проїжджаю всіх вперед',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn290028z177sk270sqe','cmdu5xn280026z1773424u5y1','Міцно, щоб контролювати',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn29002az177ofviq304','cmdu5xn280026z1773424u5y1','Як тримаю чашку кави',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn29002cz17707h6z8ze','cmdu5xn280026z1773424u5y1','Однією рукою вистачить',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2a002ez177rey7bz2r','cmdu5xn280026z1773424u5y1','Чим швидше - тим міцніше',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2b002iz177uk32se6z','cmdu5xn2a002gz177n1b8u88m','Ліві повороти зустрічних',1,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2b002kz177gk1ufywg','cmdu5xn2a002gz177n1b8u88m','Виїзди з другорядних доріг',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2c002mz177ydevsc64','cmdu5xn2a002gz177n1b8u88m','Перехрестя',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2c002oz177ncxdjacf','cmdu5xn2a002gz177n1b8u88m','Центр смуги руху',1,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2d002sz1770aef2kuf','cmdu5xn2d002qz1770kfi6m2z','Тільки гальмую',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2d002uz177ytxd73eg','cmdu5xn2d002qz1770kfi6m2z','Тільки об''їжджаю',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2e002wz177ge23lenz','cmdu5xn2d002qz1770kfi6m2z','Гальмую + готовий об''їхати в протилежний бік її руху',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2e002yz177naveozpn','cmdu5xn2d002qz1770kfi6m2z','Сигналю щоб зупинилась',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2f0032z177wwnld5gc','cmdu5xn2e0030z177tanjos3n','Техніка гальмування',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2f0034z1774vymjzld','cmdu5xn2e0030z177tanjos3n','Максимальна видимість + уникнення мертвих зон',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2f0036z1777ka8qbpf','cmdu5xn2e0030z177tanjos3n','Правило обгону',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2g0038z177y4jeivnd','cmdu5xn2e0030z177tanjos3n','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2g003cz177wxlc5nsz','cmdu5xn2g003az177z4o3jx6u','30-40 км/год',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2h003ez17753d5rbkr','cmdu5xn2g003az177z4o3jx6u','40-60 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2h003gz177dz127xau','cmdu5xn2g003az177z4o3jx6u','60-80 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2h003iz177avrv9rtt','cmdu5xn2g003az177z4o3jx6u','80+ км/год',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2i003mz177sn15a1ae','cmdu5xn2i003kz1777ofs3qfl','5-8 метрів',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2i003oz1773zp0y8yi','cmdu5xn2i003kz1777ofs3qfl','12-15 метрів',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2j003qz177y2xy8n60','cmdu5xn2i003kz1777ofs3qfl','20-25 метрів',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2j003sz177ejkzu28j','cmdu5xn2i003kz1777ofs3qfl','30+ метрів',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2k003wz177d2nz3puq','cmdu5xn2j003uz177pqo89zlv','Одразу вижимаю',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2k003yz177zyv3i67k','cmdu5xn2j003uz177pqo89zlv','Залишаю включеною, гальмую на передачі',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2k0040z177q3bb91c2','cmdu5xn2j003uz177pqo89zlv','Вижимаю коли швидкість впаде',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2l0042z1777m4o0b11','cmdu5xn2j003uz177pqo89zlv','Не думав про це',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2l0046z1771ng2ivj3','cmdu5xn2l0044z177lie3mof9','Тиснути сильніше',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2m0048z177clen6i88','cmdu5xn2l0044z177lie3mof9','Миттєво відпустити і знову взяти плавно',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2m004az177pzt80bni','cmdu5xn2l0044z177lie3mof9','Додати заднє гальмо',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2m004cz177m61uskb7','cmdu5xn2l0044z177lie3mof9','Вижати зчепу',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2n004gz177dk0jwpxp','cmdu5xn2n004ez177eifyy3vn','Нічого страшного',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2n004iz1772x8klj8n','cmdu5xn2n004ez177eifyy3vn','Мотоцикл випрямиться',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2o004kz177c9fhjgbh','cmdu5xn2n004ez177eifyy3vn','Впаду напевно',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2o004mz177g2haqzhx','cmdu5xn2n004ez177eifyy3vn','Залежить від техніки',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2p004qz177lwvsfzns','cmdu5xn2o004oz177g8m22xrz','Так, регулярно',1,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2p004sz177cno6kwfr','cmdu5xn2o004oz177g8m22xrz','Пару разів',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2p004uz177vuji4768','cmdu5xn2o004oz177g8m22xrz','Один раз',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2q004wz177wxv84d9p','cmdu5xn2o004oz177g8m22xrz','Ні',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2r0050z177gk5n3rb5','cmdu5xn2q004yz177vyq2bf7c','Так, на треку',1,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2r0052z17782kjk7ci','cmdu5xn2q004yz177vyq2bf7c','Пробував на дорозі',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2r0054z177v9pvnpq9','cmdu5xn2q004yz177vyq2bf7c','Ні, не потрібно',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2s0056z1771a98bats','cmdu5xn2q004yz177vyq2bf7c','Що це?',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2s005az177x4v9rpb2','cmdu5xn2s0058z177caagp8zt','Різке відкриття газу',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2t005cz177yaw9xtuq','cmdu5xn2s0058z177caagp8zt','Заднє колесо ковзає, потім різко чіпляється',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2t005ez177supaiths','cmdu5xn2s0058z177caagp8zt','Блокування переднього',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2t005gz177s28i5yy9','cmdu5xn2s0058z177caagp8zt','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2u005kz1778wnt3bms','cmdu5xn2u005iz177t284zmon','Різко гальмую',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2u005mz177i2da5ver','cmdu5xn2u005iz177t284zmon','Додаю газ щоб проскочити',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2v005oz1774yjjo10f','cmdu5xn2u005iz177t284zmon','Випрямляю мотоцикл, плавно закриваю газ',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2v005qz177hoaby6ju','cmdu5xn2u005iz177t284zmon','Нічого не змінюю',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2w005uz177maxwnm5e','cmdu5xn2v005sz17706vamrhf','Гальмую в повороті',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2w005wz177ralvvl6d','cmdu5xn2v005sz17706vamrhf','Намагаюсь об''їхати',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2w005yz177d84f1x04','cmdu5xn2v005sz17706vamrhf','Спочатку випрямляю мотоцикл, потім дію',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2w0060z1779bhjz4pc','cmdu5xn2v005sz17706vamrhf','Падаю напевно',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2x0064z177g76zvdtx','cmdu5xn2x0062z177qtjluxat','Міцно тримаю кермо і гальмую',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2x0066z177xp9g1fy9','cmdu5xn2x0062z177qtjluxat','Розслабляю руки, плавно відпускаю газ',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2y0068z177lhwra8jf','cmdu5xn2x0062z177qtjluxat','Різко закриваю газ',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn2y006az177v4ij8shw','cmdu5xn2x0062z177qtjluxat','Додаю газу',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn2z006ez177pjbsa136','cmdu5xn2y006cz177vnc5d9my','Сигналю',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn2z006gz177ma8m46em','cmdu5xn2y006cz177vnc5d9my','Гальмую',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn2z006iz177b3ivbdlf','cmdu5xn2y006cz177vnc5d9my','Прискорююсь вперед або різко гальмую ззаду',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn30006kz177xtk659i8','cmdu5xn2y006cz177vnc5d9my','Залишаюсь на місці',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn30006oz177h7t3kn1j','cmdu5xn30006mz177dun3hylh','40 км/год',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn31006qz177ds34c0il','cmdu5xn30006mz177dun3hylh','60 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn31006sz177gdfrcv7q','cmdu5xn30006mz177dun3hylh','80 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn31006uz177ecdysox2','cmdu5xn30006mz177dun3hylh','100 км/год',0,3,NULL);
INSERT INTO Answer VALUES('cmdu5xn32006yz177fbjjyh6m','cmdu5xn32006wz177bn5f0tc1','Краща керованість',0,0,NULL);
INSERT INTO Answer VALUES('cmdu5xn320070z17730zxs0t3','cmdu5xn32006wz177bn5f0tc1','Економія палива',0,1,NULL);
INSERT INTO Answer VALUES('cmdu5xn330072z1774pi1pmu3','cmdu5xn32006wz177bn5f0tc1','Менша площа контакту = гірше зчеплення',1,2,NULL);
INSERT INTO Answer VALUES('cmdu5xn330074z1776x78cc05','cmdu5xn32006wz177bn5f0tc1','Нічого не зміниться',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0003z154p3suz65t','cmdxjsv1c0002z154kqrctxm0','Ще не почав або перший сезон',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0004z154v29ldbp6','cmdxjsv1c0002z154kqrctxm0','2-3 сезони',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0005z154rl5ndcmi','cmdxjsv1c0002z154kqrctxm0','3-7 сезонів',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0006z15455gzg5rk','cmdxjsv1c0002z154kqrctxm0','7+ сезонів',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0009z154mc65h57d','cmdxjsv1c0008z154tmdkoxng','Так',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000az154hz7pz6f0','cmdxjsv1c0008z154tmdkoxng','Ні',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000bz154kpv5mtmk','cmdxjsv1c0008z154tmdkoxng','Не знаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000ez154h2ljxoiv','cmdxjsv1c000dz154p93jf40z','Ще не було складних',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000fz154af8j71xr','cmdxjsv1c000dz154p93jf40z','Екстрене гальмування',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000gz154hb03t3bf','cmdxjsv1c000dz154p93jf40z','Уникнення аварії маневром',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000hz1549ds4ieiq','cmdxjsv1c000dz154p93jf40z','Втрата зчеплення/заніс',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000iz1542i3g3fsk','cmdxjsv1c000dz154p93jf40z','5+ критичних ситуацій',1,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000kz154g2yx7hjy','cmdxjsv1c000jz154a5z9tm2z','Жодної',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000lz154dcn1dens','cmdxjsv1c000jz154a5z9tm2z','1-2 за сезон',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000mz154wxo9fklc','cmdxjsv1c000jz154a5z9tm2z','3-5 за сезон',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000nz154ek1xa4g5','cmdxjsv1c000jz154a5z9tm2z','Більше 5 за сезон',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000oz1541eq3naqb','cmdxjsv1c000jz154a5z9tm2z','Більше 10',0,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000rz154bfcp6czn','cmdxjsv1c000qz154elajepg3','60-80 км/год',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000sz154gkfg4l4r','cmdxjsv1c000qz154elajepg3','80-110 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000tz154t71lld0j','cmdxjsv1c000qz154elajepg3','110-150 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000uz154dh0t18pn','cmdxjsv1c000qz154elajepg3','150+ км/год',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000wz154jj3q81t3','cmdxjsv1c000vz154md3opjej','Ні, зі мною цього не станеться',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000xz154890rd5ys','cmdxjsv1c000vz154md3opjej','Занадто малоймовірно',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000yz154v11jlwjs','cmdxjsv1c000vz154md3opjej','Так, розумію ризики',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c000zz154ne0fnrxi','cmdxjsv1c000vz154md3opjej','Думаю про це досить часто',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0011z154t042k76u','cmdxjsv1c0010z154uof4x9jt','Прийняв це',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0012z154yope0032','cmdxjsv1c0010z154uof4x9jt','Купив якісну екіпіровку',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0013z154pyot6wod','cmdxjsv1c0010z154uof4x9jt','Дивився аварії в YouTube',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0014z1541xyfzwrm','cmdxjsv1c0010z154uof4x9jt','Додаткове тренування',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0015z154246eeyi1','cmdxjsv1c0010z154uof4x9jt','Комплексний підхід',1,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0017z154vngyavv4','cmdxjsv1c0016z1540oa0tfj3','Ні, мене це відлякує',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0018z154ondfnlda','cmdxjsv1c0016z1540oa0tfj3','Кілька відео',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0019z154qozdqt5d','cmdxjsv1c0016z1540oa0tfj3','10-50 відео',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001az154i3otuiq6','cmdxjsv1c0016z1540oa0tfj3','50-100 відео',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001bz1545zhi5eaw','cmdxjsv1c0016z1540oa0tfj3','100+ відео',1,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001dz154jvp0p0af','cmdxjsv1c001cz1543fjkwoub','Повний якісний екіп завжди',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001ez154bxpcjskt','cmdxjsv1c001cz1543fjkwoub','Легкий або комбінований в залежності від ситуації',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001fz1547nixg4y0','cmdxjsv1c001cz1543fjkwoub','Футболка, шорти, шолом',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001gz1549hu7pozs','cmdxjsv1c001cz1543fjkwoub','Я фаталіст, навіть без шолому',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001jz154f378jmj6','cmdxjsv1c001iz15443i0hyh4','Їду далі без змін, бо ми на головній і зелений',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001kz154trwwh0ij','cmdxjsv1c001iz15443i0hyh4','Сповільнююсь, сканую перехрестя',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001lz154i741mt6p','cmdxjsv1c001iz15443i0hyh4','Прискорююсь щоб швидше уйти',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001mz154wwjwdp5q','cmdxjsv1c001iz15443i0hyh4','Сильно гальмую на всяк випадок',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001oz154r9dmyflr','cmdxjsv1c001nz154se4311dc','По центру',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001pz154lxsfb95r','cmdxjsv1c001nz154se4311dc','Лівий край',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001qz154o12g66im','cmdxjsv1c001nz154se4311dc','Правий край',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001rz154n9f3svp6','cmdxjsv1c001nz154se4311dc','Постійно змінюю позицію',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001uz154m8c7xkp5','cmdxjsv1c001tz1547h07cfmh','Додам газу, ввімкну дальній щоб він зрозумів, що я їду',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001vz1540i4kndqr','cmdxjsv1c001tz1547h07cfmh','Прикриваю газ, бо все одно може виїхати',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001wz154gags8kkh','cmdxjsv1c001tz1547h07cfmh','Я зупинюсь і пропущу на всяк випадок',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001xz1544x32xxsy','cmdxjsv1c001tz1547h07cfmh','Нічого не роблю, він мене бачить, я на головній',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c001zz154y4tvzflm','cmdxjsv1c001yz154gmbsrro2','Той, хто збив',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0020z1541vxlbmc5','cmdxjsv1c001yz154gmbsrro2','Я винен, бо дозволив це зробити',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0021z154865w7lfz','cmdxjsv1c001yz154gmbsrro2','Суд розбереться',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0023z1546m74n5dz','cmdxjsv1c0022z1541cy2crn1','Я не чекаю від них правильних дій',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0024z154x0p6mnf5','cmdxjsv1c0022z1541cy2crn1','Майже кожен раз, коли їду',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0025z1543rwitdyr','cmdxjsv1c0022z1541cy2crn1','Досить часто порушують правила',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0026z154cqlsfzzt','cmdxjsv1c0022z1541cy2crn1','Іноді бувають складні ситуації',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0028z154tx8gpnvd','cmdxjsv1c0027z154d85ghqbq','Їду по центру смуги за нею, щоб сховатись від вітру',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0029z154ozer9vbk','cmdxjsv1c0027z154d85ghqbq','Зліва, щоб бачити дорогу попереду і бути видимим',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002az154vp5flktb','cmdxjsv1c0027z154d85ghqbq','Не триматись за фурой, відтягнутись або обігнати',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002bz154wksxgtl3','cmdxjsv1c0027z154d85ghqbq','Справа, щоб мати змогу уйти на обочину',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002dz154icp575po','cmdxjsv1c002cz1547jxy564v','Прискорюсь щоб проскочити перед нею',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002ez154a0uzf8zd','cmdxjsv1c002cz1547jxy564v','Переміщусь лівіше щоб дати їй місце',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002fz154vzk4hpdr','cmdxjsv1c002cz1547jxy564v','Залишусь на місці і почекаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002gz154iosrqzzq','cmdxjsv1c002cz1547jxy564v','Зміщусь правіше в смузі і прикрию газ',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002iz1545ft2ge72','cmdxjsv1c002hz154guzmmjmt','Скрізь їжджу рівномірно',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002jz154b872pc4p','cmdxjsv1c002hz154guzmmjmt','Перед кожним перехрестям і виїздом',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002kz154iacljnd6','cmdxjsv1c002hz154guzmmjmt','Тільки коли бачу небезпеку',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002lz15439pgjyad','cmdxjsv1c002hz154guzmmjmt','Коли світлофор жовтий',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002nz154mucvqg5a','cmdxjsv1c002mz154xfs2z3td','12 м',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002oz154kiqjqslh','cmdxjsv1c002mz154xfs2z3td','15 м',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002pz154wb5fnkf7','cmdxjsv1c002mz154xfs2z3td','19 м',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002qz1549xhxoj5e','cmdxjsv1c002mz154xfs2z3td','23 м',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002rz1543bqf601r','cmdxjsv1c002mz154xfs2z3td','Честно - Не знаю не пробував',0,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002tz154rq29m0ha','cmdxjsv1c002sz154w8dgcmwn','20-25 м',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002uz1541nvckfqj','cmdxjsv1c002sz154w8dgcmwn','30-35 м',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002vz154wdzfpt66','cmdxjsv1c002sz154w8dgcmwn','40-45 м',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002wz154tma6xhkd','cmdxjsv1c002sz154w8dgcmwn','50+ м',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002xz154g69qd7zk','cmdxjsv1c002sz154w8dgcmwn','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c002zz154ud59pvpw','cmdxjsv1c002yz154963veg35','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0030z154ks24u8zk','cmdxjsv1c002yz154963veg35','Так, заднього',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0031z154iaodwi3b','cmdxjsv1c002yz154963veg35','Так, переднього',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0032z1545avw9f8c','cmdxjsv1c002yz154963veg35','Обох',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0034z154d69qnm31','cmdxjsv1c0033z154kx3tlrga','Тримати гальмо далі',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0035z154o8dnlnfd','cmdxjsv1c0033z154kx3tlrga','Відпустити гальмо миттєво',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0036z15462jtea3u','cmdxjsv1c0033z154kx3tlrga','Додати заднє гальмо',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0037z154y2rrfobj','cmdxjsv1c0033z154kx3tlrga','Вижати зчеплення',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0039z154uh6n07x3','cmdxjsv1c0038z154nqscrdh0','Нічого страшного, якщо робити це правильно',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003az15469tqhiia','cmdxjsv1c0038z154nqscrdh0','Мотоцикл випрямиться, і можливий highside',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003bz154c6ogf3og','cmdxjsv1c0038z154nqscrdh0','Впаду',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003cz1542ix5y059','cmdxjsv1c0038z154nqscrdh0','Залежить від швидкості',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003ez15497s0jogh','cmdxjsv1c003dz154wx9cxw73','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003fz1540678i0g8','cmdxjsv1c003dz154wx9cxw73','Треба пробувати',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003gz154mk6dldsm','cmdxjsv1c003dz154wx9cxw73','Так, вмію',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003iz154jzic355g','cmdxjsv1c003hz154l27yqdif','Не знаю, не було такого',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003jz1545cltzoly','cmdxjsv1c003hz154l27yqdif','Трохи послаблю передні гальма',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003kz154869h2q69','cmdxjsv1c003hz154l27yqdif','Різко відпущу всі гальма',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003lz154sac5fi8i','cmdxjsv1c003hz154l27yqdif','Вижму зчеплення, щоб опустити мотік',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003nz154yfb0wn0s','cmdxjsv1c003mz1549aoes6fz','Гальмівні колодки розігрілись і стали м''якшими',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003oz154m4qrxjqs','cmdxjsv1c003mz1549aoes6fz','Перегрів, гальмівна рідина сильно нагрілась',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003pz154nsm1x0u7','cmdxjsv1c003mz1549aoes6fz','Це нормально, психіка райдера сприймає гальма як м''які',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003qz154g6u28q82','cmdxjsv1c003mz1549aoes6fz','Закінчилась гальмівна рідина',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003sz154z37byhab','cmdxjsv1c003rz1548w70m4rj','Просто переднім гальмом',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003tz154zqq9pckc','cmdxjsv1c003rz1548w70m4rj','Переднім, заднім і одночасно витискаєте зчеплення',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003uz1548f324mpf','cmdxjsv1c003rz1548w70m4rj','Спочатку задне, потім передне + витискаєте зчеплення',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003vz1542gxqq32f','cmdxjsv1c003rz1548w70m4rj','Спочатку задне, потім передне - без зчеплення',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003xz1544w87n2fb','cmdxjsv1c003wz1540usqmjmz','5-7 секунд',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003yz154oxj8dta9','cmdxjsv1c003wz1540usqmjmz','2.5-3 секунди',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c003zz154ulp1c74y','cmdxjsv1c003wz1540usqmjmz','7.5-9.5 секунд',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0040z154p7ok8fs0','cmdxjsv1c003wz1540usqmjmz','11.3 секунди',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0041z1546tq65k64','cmdxjsv1c003wz1540usqmjmz','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0043z154wkr51ham','cmdxjsv1c0042z1542pwaw86f','Нічого не зміниться',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0044z1540heok2vq','cmdxjsv1c0042z1542pwaw86f','Гальмівний шлях збільшиться, АБС спрацьовуватиме частіше',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0045z1542hqb84wj','cmdxjsv1c0042z1542pwaw86f','Гальмівний шлях зменшиться - більше тиску в місцях зчеплення',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0046z154ix6rizs6','cmdxjsv1c0042z1542pwaw86f','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0048z154qw7z19q7','cmdxjsv1c0047z154zjlvn1qi','Одразу вижати нейтраль через зчепу',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0049z154uref3a8v','cmdxjsv1c0047z154zjlvn1qi','Залишитись і не чіпати коробку',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004az15491xsqbwx','cmdxjsv1c0047z154zjlvn1qi','Гальмувати і одночасно понижувати передачу',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004bz15410kgqojk','cmdxjsv1c0047z154zjlvn1qi','Включити першу, бо там найбільше гальмування двигуном',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004dz154hnd7i7hn','cmdxjsv1c004cz1546jl85g7z','Загальмую жорсткіше - адреналін допоможе',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004ez154jrrvqji6','cmdxjsv1c004cz1546jl85g7z','Скоріш за все буду гальмувати як звик - м''яко',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004fz154qaelnx3q','cmdxjsv1c004cz1546jl85g7z','Інстинкти підкажуть',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004gz154mz6k7myc','cmdxjsv1c004cz1546jl85g7z','Не знаю, не було ситуацій',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004iz15490d92mvt','cmdxjsv1c004hz154diwxs5g2','Розслаблено як завжди',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004jz154n8cvtoxc','cmdxjsv1c004hz154diwxs5g2','Міцно стиснути бак',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004kz15421n117ln','cmdxjsv1c004hz154diwxs5g2','Розвести в сторони, для більшого супротиву повітря',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004lz154oncbwc0i','cmdxjsv1c004hz154diwxs5g2','Не має значення',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004nz154d9f700k9','cmdxjsv1c004mz1549crjzlpx','Тільки в екстреній ситуації одночасно з переднім і зчепленням',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004oz154xv8zb36a','cmdxjsv1c004mz1549crjzlpx','При гальмуванні на поворотах',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004pz154aw5gtp1u','cmdxjsv1c004mz1549crjzlpx','При гальмуванні на слизькій дорозі',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004qz154qgmipzav','cmdxjsv1c004mz1549crjzlpx','В міжрядді',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004rz1541ik3bp2g','cmdxjsv1c004mz1549crjzlpx','Завжди разом з переднім',1,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004tz1543brffxm9','cmdxjsv1c004sz154lm7r377o','Приблизно, їжджу по центру',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004uz154ztc35ksa','cmdxjsv1c004sz154lm7r377o','Так, чітко, вузький вхід',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004vz154ax9tvqur','cmdxjsv1c004sz154lm7r377o','Так, чітко, широкий вхід',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004xz154rf74rkiz','cmdxjsv1c004wz154yoev6vhc','40-60 км/год',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004yz154a2k4dj85','cmdxjsv1c004wz154yoev6vhc','60-80 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c004zz15498ypy6t1','cmdxjsv1c004wz154yoev6vhc','80-100 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0050z154xyp2s6o1','cmdxjsv1c004wz154yoev6vhc','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0052z154h5jehgxh','cmdxjsv1c0051z154ydogy21y','40-60 км/год',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0053z1545azx2b61','cmdxjsv1c0051z154ydogy21y','60-80 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0054z154k54pnup9','cmdxjsv1c0051z154ydogy21y','80-100 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0055z15406us0nb4','cmdxjsv1c0051z154ydogy21y','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0057z1544uriqhzk','cmdxjsv1c0056z15400tavk90','Ні і це мене турбує',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0058z15468nz99qx','cmdxjsv1c0056z15400tavk90','Дуже приблизно',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c0059z1547mjarwwl','cmdxjsv1c0056z15400tavk90','Так, знаю точно',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c005bz154ibwrqzhx','cmdxjsv1c005az154ntyxg4g9','Слабкі м''язи, треба в спортзал',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c005cz1546yzlcxfm','cmdxjsv1c005az154ntyxg4g9','Слабо тримаюсь колінами',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c005dz154ijf7ocdu','cmdxjsv1c005az154ntyxg4g9','Треба збільшувати кут нахилу',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c005ez154g6j302yv','cmdxjsv1c005az154ntyxg4g9','Неспортивне кермо, треба міняти',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c005gz154m48v8wgo','cmdxjsv1c005fz154vgaungg4','Закрити газ',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c005hz154wqbxdt9e','cmdxjsv1c005fz154vgaungg4','Відкрити газ',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c005iz154qdgi87ai','cmdxjsv1c005fz154vgaungg4','Тримати газ без змін',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1c005jz154ddghb9bt','cmdxjsv1c005fz154vgaungg4','Притримати передній гальмо і молитися',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005lz154bpf21i7u','cmdxjsv1c005kz154tciqmwtn','Продовжую як зазвичай, пісок не страшний',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005mz154209owp3k','cmdxjsv1c005kz154tciqmwtn','Максимально випрямляю мотоцикл перед піском',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005nz154xysaqjme','cmdxjsv1c005kz154tciqmwtn','Гальмую переднім гальмом',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005oz1545ndokvrd','cmdxjsv1c005kz154tciqmwtn','Гальмую заднім гальмом і зчепленням',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005qz154rvb2xm1n','cmdxjsv1d005pz1547wmku6ki','До 40 км/год',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005rz154a7wqimk1','cmdxjsv1d005pz1547wmku6ki','40-60 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005sz154k5v7kze4','cmdxjsv1d005pz1547wmku6ki','60-80 км/год',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005tz154z6qci11e','cmdxjsv1d005pz1547wmku6ki','80-100 км/год',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005uz154h3eba60l','cmdxjsv1d005pz1547wmku6ki','Чим швидше - тим міцніше',0,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005wz1547sqk3ifm','cmdxjsv1d005vz154gfz0h1u8','Вдень щоб мене бачили, вночі вимикаю',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005xz1540t5d13vw','cmdxjsv1d005vz154gfz0h1u8','І вдень і вночі = краще мене видно навіть якщо осліплю когось',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005yz154yh6bih1p','cmdxjsv1d005vz154gfz0h1u8','Ніколи, в місті достатньо освітлення',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d005zz154ifu3jzvq','cmdxjsv1d005vz154gfz0h1u8','Тільки якщо вулиця пуста і темна',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0061z154zsf0bh2r','cmdxjsv1d0060z15407mqrgyp','Міцно, щоб контролювати',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0062z1540njuacus','cmdxjsv1d0060z15407mqrgyp','Як тримаєш склянку кави',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0063z154jdgxz6e9','cmdxjsv1d0060z15407mqrgyp','Залежить від дороги',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0065z154834c57ns','cmdxjsv1d0064z154npnz86x2','Ні, боюсь',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0066z1548igg1nx9','cmdxjsv1d0064z154npnz86x2','Рідко, некомфортно',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0067z1549h3ub6vl','cmdxjsv1d0064z154npnz86x2','Іноді, нормально',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0068z154mlrcwh90','cmdxjsv1d0064z154npnz86x2','Часто, комфортно',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0069z154aue405qe','cmdxjsv1d0064z154npnz86x2','Постійно, як риба у воді',1,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006bz154vtmuygwe','cmdxjsv1d006az1545g9z3kui','Проїду всіх і стану попереду',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006cz154qxecth4k','cmdxjsv1d006az1545g9z3kui','Між машинами де є місце',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006dz154f3hd07fu','cmdxjsv1d006az1545g9z3kui','Справа від крайньої лівої машини',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006ez154unl3xc3n','cmdxjsv1d006az1545g9z3kui','Справа від крайньої правої',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006gz154xenim6zl','cmdxjsv1d006fz154imk8tt2y','На поворотник - він же попереджує',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006hz1548pijswtr','cmdxjsv1d006fz154imk8tt2y','На водія - чи дивиться в дзеркало',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006iz154p66nb4q4','cmdxjsv1d006fz154imk8tt2y','На передні колеса - чи почали повертатись?',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006jz154d5ukp4aa','cmdxjsv1d006fz154imk8tt2y','На тренд руху автівки',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006lz154dy62qdls','cmdxjsv1d006kz1546n8bdebj','Зупинюсь і почекаю',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006mz154wypk7bf3','cmdxjsv1d006kz1546n8bdebj','Зробити перегазовку щоб він зрозумів',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006nz1544bfs2wxc','cmdxjsv1d006kz1546n8bdebj','Посигналити делікатно',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006oz1549hie1o8i','cmdxjsv1d006kz1546n8bdebj','Уйти в інший міжряддя',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006qz154l3gy4pwp','cmdxjsv1d006pz154p7uepnrr','Їдемо між машиною і бордюром',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006rz154m1zx8ozl','cmdxjsv1d006pz154p7uepnrr','По тротуару',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006sz15469zrklr6','cmdxjsv1d006pz154p7uepnrr','Почекати в потоці',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006tz154gn5h384z','cmdxjsv1d006pz154p7uepnrr','Погазувати щоб пропустили',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006vz1547kpa34v6','cmdxjsv1d006uz154yw2156f9','Привітатись',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006wz154zhmyoqr4','cmdxjsv1d006uz154yw2156f9','Прискоритись щоб не обігнав',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006xz154w6kv4lyy','cmdxjsv1d006uz154yw2156f9','Перестроїтись і пропустити',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d006yz154lvnonx8h','cmdxjsv1d006uz154yw2156f9','Ігнорувати його',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0070z154jpa6kco7','cmdxjsv1d006zz154kvgwqv8u','Щоб показати що вони ендуристи',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0071z1540198squ8','cmdxjsv1d006zz154kvgwqv8u','Щоб показати що вони власник BMW GS 1250',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0072z154sqz5yi9j','cmdxjsv1d006zz154kvgwqv8u','Щоб розім''яти ноги',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0073z154de5vx6v9','cmdxjsv1d006zz154kvgwqv8u','Щоб бачити далі через машини',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0074z154hug892of','cmdxjsv1d006zz154kvgwqv8u','Це круто виглядає',0,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0077z154w4grildr','cmdxjsv1d0076z1544gzpf0oj','Міцно тримаю кермо і гальмую',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0078z1546ghuz2cy','cmdxjsv1d0076z1544gzpf0oj','Розслабляю руки, плавно відпускаю газ',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0079z154axtqi235','cmdxjsv1d0076z1544gzpf0oj','Різко закриваю газ',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007az154vahbed6c','cmdxjsv1d0076z1544gzpf0oj','Додаю газу',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007bz154sgpiei4w','cmdxjsv1d0076z1544gzpf0oj','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007dz154dadw55cu','cmdxjsv1d007cz154moe2lbxk','Різко гальмувати',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007ez154t9y7tauh','cmdxjsv1d007cz154moe2lbxk','Додати газу',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007fz154jpdogyh6','cmdxjsv1d007cz154moe2lbxk','Випрямити мотоцикл, плавно закрити газ',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007gz154a4rcpals','cmdxjsv1d007cz154moe2lbxk','Нічого не змінювати',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007iz1546efsn6h1','cmdxjsv1d007hz1544hb339np','На 20-30%',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007jz1549xnyssrb','cmdxjsv1d007hz1544hb339np','В 1.25-1.5 рази',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007kz154i7eqyqvb','cmdxjsv1d007hz1544hb339np','В 2-3 рази',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007lz1546pk5x866','cmdxjsv1d007hz1544hb339np','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007nz15497kx38mg','cmdxjsv1d007mz1542j3l9dsq','Захист від подряпин колінами',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007oz154q7ttookj','cmdxjsv1d007mz1542j3l9dsq','Захист від бензинових плям',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007pz154ed011am4','cmdxjsv1d007mz1542j3l9dsq','Для зручності при гальмуванні',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007qz154fp8f6jdp','cmdxjsv1d007mz1542j3l9dsq','Для більшого контролю ногами',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007sz154wj2dlkqm','cmdxjsv1d007rz154vp6k74nj','Круто, всі чують що я їду',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007tz1541f3in10j','cmdxjsv1d007rz154vp6k74nj','Безпека - гучний байк помітніший',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007uz1545cj51kaf','cmdxjsv1d007rz154vp6k74nj','Не люблю, це неповага до оточуючих',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007vz154tqqysky4','cmdxjsv1d007rz154vp6k74nj','Використовую помірно гучну систему для безпеки',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007xz154p13n5ye7','cmdxjsv1d007wz1540l12rgkc','Знаю точно і перевіряю регулярно',1,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007yz1540sgu8zde','cmdxjsv1d007wz1540l12rgkc','Знаю приблизно',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d007zz154tck2yjsp','cmdxjsv1d007wz1540l12rgkc','Не знаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0081z1545h6s391b','cmdxjsv1d0080z154p0jagr9k','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0082z154h4rsdhts','cmdxjsv1d0080z154p0jagr9k','Напевно',0,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0083z154ysw0mmxb','cmdxjsv1d0080z154p0jagr9k','Так, регулярно, їжджу по пробках',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0084z154q7gj4d7g','cmdxjsv1d0080z154p0jagr9k','Так, регулярно, їздив в дощ і по холодному',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0086z154s41o5a35','cmdxjsv1d0085z154oth56q3j','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0087z1545j7lm2nz','cmdxjsv1d0085z154oth56q3j','Трохи джимхани',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0088z154xruwam6h','cmdxjsv1d0085z154oth56q3j','Трохи треку',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d0089z154rv5rr45f','cmdxjsv1d0085z154oth56q3j','Обидва напрямки',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008bz154pp74yyen','cmdxjsv1d008az1544sjzvatg','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008cz1542aayfj5t','cmdxjsv1d008az1544sjzvatg','1-2 людини',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008dz154ilziwxe6','cmdxjsv1d008az1544sjzvatg','Кілька досвідчених',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008ez154nxbrnnxm','cmdxjsv1d008az1544sjzvatg','Велика спільнота',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008gz154pm1qsgpe','cmdxjsv1d008fz154sdkzlion','Тільки сам',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008hz154tymyq4dm','cmdxjsv1d008fz154sdkzlion','Іноді з друзями',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008iz154ejldqii0','cmdxjsv1d008fz154sdkzlion','Регулярно в групі',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008kz154fp4u4h84','cmdxjsv1d008jz154a15pxtko','Нікого немає',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008lz1548pzcfwgk','cmdxjsv1d008jz154a15pxtko','Друзі',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008mz1548fpsu7h0','cmdxjsv1d008jz154a15pxtko','Механік/СТО',1,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008nz154p64dv4nb','cmdxjsv1d008jz154a15pxtko','Онлайн спільноти',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008pz1547zozhd2m','cmdxjsv1d008oz1547zy8a9y1','Вони вже вміють',0,0,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008qz154paka18sm','cmdxjsv1d008oz1547zy8a9y1','Не треба бо вони вже можуть передбачити ситуацію',1,1,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008rz154er5wjbd8','cmdxjsv1d008oz1547zy8a9y1','Бо можна впасти і подряпати дорогий байк',0,2,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008sz154vpol7jk6','cmdxjsv1d008oz1547zy8a9y1','Бояться, бо зі швидкості можна перекинутись через кермо і зламати шию',1,3,NULL);
INSERT INTO Answer VALUES('cmdxjsv1d008tz154a6yev15q','cmdxjsv1d008oz1547zy8a9y1','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdya56zl0003z19ehjiv3r4h','cmdya56zl0002z19ea7z5oo41','Ще не почав або перший сезон',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zl0004z19epl8td80z','cmdya56zl0002z19ea7z5oo41','2-3 сезони',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zl0005z19evp4duq19','cmdya56zl0002z19ea7z5oo41','3-7 сезонів',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zl0006z19etvavu0uz','cmdya56zl0002z19ea7z5oo41','7+ сезонів',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0009z19e3t2ghwsp','cmdya56zm0008z19eaj2xg4uz','Так',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm000az19eik21lkor','cmdya56zm0008z19eaj2xg4uz','Ні',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm000bz19er7o9r429','cmdya56zm0008z19eaj2xg4uz','Не знаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm000ez19e0z1lw5r9','cmdya56zm000dz19e396t3m3k','Ще не було складних',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm000fz19ewhi2b3ev','cmdya56zm000dz19e396t3m3k','Екстрене гальмування',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm000gz19enf02y2sz','cmdya56zm000dz19e396t3m3k','Уникнення аварії маневром',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm000hz19e7t1f9t0p','cmdya56zm000dz19e396t3m3k','Втрата зчеплення/заніс',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm000iz19esjr9073m','cmdya56zm000dz19e396t3m3k','5+ критичних ситуацій',1,4,NULL);
INSERT INTO Answer VALUES('cmdya56zm000kz19exhqlews3','cmdya56zm000jz19e8nogjpd7','Жодної',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm000lz19e0on2qd7v','cmdya56zm000jz19e8nogjpd7','1-2 за сезон',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm000mz19e9chne0ao','cmdya56zm000jz19e8nogjpd7','3-5 за сезон',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm000nz19ehdbfmh9n','cmdya56zm000jz19e8nogjpd7','Більше 5 за сезон',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm000oz19ezl8wf1xk','cmdya56zm000jz19e8nogjpd7','Більше 10',0,4,NULL);
INSERT INTO Answer VALUES('cmdya56zm000rz19enjgjteqo','cmdya56zm000qz19etdcanjuh','60-80 км/год',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm000sz19ega68awi0','cmdya56zm000qz19etdcanjuh','80-110 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm000tz19eqhy2t8eo','cmdya56zm000qz19etdcanjuh','110-150 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm000uz19eua5jcamt','cmdya56zm000qz19etdcanjuh','150+ км/год',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm000wz19e2qvq795h','cmdya56zm000vz19e8w2a17sn','Ні, зі мною цього не станеться',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm000xz19es97a7b4c','cmdya56zm000vz19e8w2a17sn','Занадто малоймовірно',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm000yz19e2nm5it5x','cmdya56zm000vz19e8w2a17sn','Так, розумію ризики',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm000zz19e58xx78kt','cmdya56zm000vz19e8w2a17sn','Думаю про це досить часто',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0011z19ejepvz6zc','cmdya56zm0010z19e9e696p55','Прийняв це',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0012z19ey6jla6gh','cmdya56zm0010z19e9e696p55','Купив якісну екіпіровку',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0013z19e6hdhxdb9','cmdya56zm0010z19e9e696p55','Дивився аварії в YouTube',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0014z19exe8j2308','cmdya56zm0010z19e9e696p55','Додаткове тренування',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0015z19edfrs5aws','cmdya56zm0010z19e9e696p55','Комплексний підхід',1,4,NULL);
INSERT INTO Answer VALUES('cmdya56zm0017z19esnw5jqcu','cmdya56zm0016z19e346weya9','Ні, мене це відлякує',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0018z19ey1wisej4','cmdya56zm0016z19e346weya9','Кілька відео',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0019z19eokmx2t8r','cmdya56zm0016z19e346weya9','10-50 відео',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm001az19ewc5afes5','cmdya56zm0016z19e346weya9','50-100 відео',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm001bz19e0cmn89m5','cmdya56zm0016z19e346weya9','100+ відео',1,4,NULL);
INSERT INTO Answer VALUES('cmdya56zm001dz19e1w3uei8l','cmdya56zm001cz19epjk8w3fz','Повний якісний екіп завжди',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm001ez19evfasny8i','cmdya56zm001cz19epjk8w3fz','Легкий або комбінований в залежності від ситуації',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm001fz19ecb8f94qk','cmdya56zm001cz19epjk8w3fz','Футболка, шорти, шолом',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm001gz19efrzaonbv','cmdya56zm001cz19epjk8w3fz','Я фаталіст, навіть без шолому',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm001jz19eoxlstwi7','cmdya56zm001iz19evq36r1aw','Їду далі без змін, бо ми на головній і зелений',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm001kz19eljtbovoq','cmdya56zm001iz19evq36r1aw','Сповільнююсь, сканую перехрестя',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm001lz19e9x3qt1th','cmdya56zm001iz19evq36r1aw','Прискорююсь щоб швидше уйти',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm001mz19egrtskuj9','cmdya56zm001iz19evq36r1aw','Сильно гальмую на всяк випадок',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm001oz19ev5almued','cmdya56zm001nz19ec013wmtn','По центру',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm001pz19emtrj7wfy','cmdya56zm001nz19ec013wmtn','Лівий край',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm001qz19e3bo4wt3b','cmdya56zm001nz19ec013wmtn','Правий край',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm001rz19er4hbh7gn','cmdya56zm001nz19ec013wmtn','Постійно змінюю позицію',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm001uz19ec1mtvec8','cmdya56zm001tz19eq83h8ly2','Додам газу, ввімкну дальній щоб він зрозумів, що я їду',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm001vz19ez3svi8ep','cmdya56zm001tz19eq83h8ly2','Прикриваю газ, бо все одно може виїхати',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm001wz19e5pxs9t3j','cmdya56zm001tz19eq83h8ly2','Я зупинюсь і пропущу на всяк випадок',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm001xz19esphn3qoa','cmdya56zm001tz19eq83h8ly2','Нічого не роблю, він мене бачить, я на головній',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm001zz19e95qxaelg','cmdya56zm001yz19eobmzrcvb','Той, хто збив',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0020z19eoif7cdyh','cmdya56zm001yz19eobmzrcvb','Я винен, бо дозволив це зробити',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0021z19e9tms682r','cmdya56zm001yz19eobmzrcvb','Суд розбереться',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0023z19ett05yquf','cmdya56zm0022z19entejbc8q','Я не чекаю від них правильних дій',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0024z19ecgb4cvir','cmdya56zm0022z19entejbc8q','Майже кожен раз, коли їду',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0025z19e3t28gw2h','cmdya56zm0022z19entejbc8q','Досить часто порушують правила',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0026z19e7sjj16ys','cmdya56zm0022z19entejbc8q','Іноді бувають складні ситуації',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0028z19ezg8m5yfn','cmdya56zm0027z19ew035fumn','Їду по центру смуги за нею, щоб сховатись від вітру',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0029z19ewwvvfwde','cmdya56zm0027z19ew035fumn','Зліва, щоб бачити дорогу попереду і бути видимим',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm002az19epwizohb6','cmdya56zm0027z19ew035fumn','Не триматись за фурой, відтягнутись або обігнати',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm002bz19e4i64m09t','cmdya56zm0027z19ew035fumn','Справа, щоб мати змогу уйти на обочину',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm002dz19enxcgsn4t','cmdya56zm002cz19ep9ljjmqq','Прискорюсь щоб проскочити перед нею',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm002ez19e5ph55tcj','cmdya56zm002cz19ep9ljjmqq','Переміщусь лівіше щоб дати їй місце',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm002fz19erbpwfzf0','cmdya56zm002cz19ep9ljjmqq','Залишусь на місці і почекаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm002gz19exs0n5rpi','cmdya56zm002cz19ep9ljjmqq','Зміщусь правіше в смузі і прикрию газ',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm002iz19e88tugfj5','cmdya56zm002hz19en1ptoleo','Скрізь їжджу рівномірно',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm002jz19ewe6btt3v','cmdya56zm002hz19en1ptoleo','Перед кожним перехрестям і виїздом',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm002kz19ekdoykmbw','cmdya56zm002hz19en1ptoleo','Тільки коли бачу небезпеку',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm002lz19e8x6palmf','cmdya56zm002hz19en1ptoleo','Коли світлофор жовтий',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm002nz19ett2i7nnj','cmdya56zm002mz19e72zlyl47','12 м',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm002oz19e1e0o1vp6','cmdya56zm002mz19e72zlyl47','15 м',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm002pz19em1xc4sf4','cmdya56zm002mz19e72zlyl47','19 м',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm002qz19ex8941rd4','cmdya56zm002mz19e72zlyl47','23 м',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm002rz19eg7nfmkh5','cmdya56zm002mz19e72zlyl47','Честно - Не знаю не пробував',0,4,NULL);
INSERT INTO Answer VALUES('cmdya56zm002tz19ernk277bo','cmdya56zm002sz19ehb5737hr','20-25 м',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm002uz19ezaqkrs2b','cmdya56zm002sz19ehb5737hr','30-35 м',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm002vz19e6rwlwcl3','cmdya56zm002sz19ehb5737hr','40-45 м',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm002wz19e5qswvm0n','cmdya56zm002sz19ehb5737hr','50+ м',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm002xz19epck3wdcj','cmdya56zm002sz19ehb5737hr','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdya56zm002zz19ewz3at5v1','cmdya56zm002yz19etb2qisyo','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0030z19eronx5fpe','cmdya56zm002yz19etb2qisyo','Так, заднього',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0031z19e4qs4mduj','cmdya56zm002yz19etb2qisyo','Так, переднього',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0032z19eumrd3r44','cmdya56zm002yz19etb2qisyo','Обох',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0034z19e01866klx','cmdya56zm0033z19exx2xyu33','Тримати гальмо далі',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0035z19ec38fz8fm','cmdya56zm0033z19exx2xyu33','Відпустити гальмо миттєво',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0036z19e6j1tiw3b','cmdya56zm0033z19exx2xyu33','Додати заднє гальмо',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0037z19e481mk7ft','cmdya56zm0033z19exx2xyu33','Вижати зчеплення',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0039z19erdjwnqsp','cmdya56zm0038z19e6raxjr6i','Нічого страшного, якщо робити це правильно',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm003az19exq3em4n4','cmdya56zm0038z19e6raxjr6i','Мотоцикл випрямиться, і можливий highside',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm003bz19e6y2uxnu9','cmdya56zm0038z19e6raxjr6i','Впаду',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm003cz19ewooiaaq4','cmdya56zm0038z19e6raxjr6i','Залежить від швидкості',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm003ez19ev3bg1w7t','cmdya56zm003dz19el1ea1coi','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm003fz19exfdj7a19','cmdya56zm003dz19el1ea1coi','Треба пробувати',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm003gz19eezneyb3d','cmdya56zm003dz19el1ea1coi','Так, вмію',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm003iz19ez76a1mg3','cmdya56zm003hz19e93v0u36m','Не знаю, не було такого',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm003jz19eeuhrrrf7','cmdya56zm003hz19e93v0u36m','Трохи послаблю передні гальма',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm003kz19ey3yrwqpc','cmdya56zm003hz19e93v0u36m','Різко відпущу всі гальма',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm003lz19enocizbzs','cmdya56zm003hz19e93v0u36m','Вижму зчеплення, щоб опустити мотік',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm003nz19e3w56cv91','cmdya56zm003mz19eitz3p6rx','Гальмівні колодки розігрілись і стали м''якшими',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm003oz19eyk6w3hdg','cmdya56zm003mz19eitz3p6rx','Перегрів, гальмівна рідина сильно нагрілась',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm003pz19e3k0fkf07','cmdya56zm003mz19eitz3p6rx','Це нормально, психіка райдера сприймає гальма як м''які',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm003qz19e4vh82ant','cmdya56zm003mz19eitz3p6rx','Закінчилась гальмівна рідина',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm003sz19esaetn136','cmdya56zm003rz19elbjdrl80','Просто переднім гальмом',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm003tz19ewocb8qzo','cmdya56zm003rz19elbjdrl80','Переднім, заднім і одночасно витискаєте зчеплення',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm003uz19end18w0fg','cmdya56zm003rz19elbjdrl80','Спочатку задне, потім передне + витискаєте зчеплення',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm003vz19eadqtz4vk','cmdya56zm003rz19elbjdrl80','Спочатку задне, потім передне - без зчеплення',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm003xz19eu8zaksnm','cmdya56zm003wz19ei0n6o3rc','5-7 секунд',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm003yz19eeao2mu50','cmdya56zm003wz19ei0n6o3rc','2.5-3 секунди',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm003zz19e3zpyp5vb','cmdya56zm003wz19ei0n6o3rc','7.5-9.5 секунд',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0040z19edvvk77m2','cmdya56zm003wz19ei0n6o3rc','11.3 секунди',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0041z19es0ufzetv','cmdya56zm003wz19ei0n6o3rc','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdya56zm0043z19efgxx6qmw','cmdya56zm0042z19eqdsl8m97','Нічого не зміниться',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0044z19epcfyzm7r','cmdya56zm0042z19eqdsl8m97','Гальмівний шлях збільшиться, АБС спрацьовуватиме частіше',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0045z19edp6vy2bh','cmdya56zm0042z19eqdsl8m97','Гальмівний шлях зменшиться - більше тиску в місцях зчеплення',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0046z19e9btrcrpc','cmdya56zm0042z19eqdsl8m97','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0048z19edc0zk37n','cmdya56zm0047z19e9mffd47r','Одразу вижати нейтраль через зчепу',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0049z19e7sch82ka','cmdya56zm0047z19e9mffd47r','Залишитись і не чіпати коробку',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm004az19e8xwfcqjl','cmdya56zm0047z19e9mffd47r','Гальмувати і одночасно понижувати передачу',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm004bz19eazf5dwt7','cmdya56zm0047z19e9mffd47r','Включити першу, бо там найбільше гальмування двигуном',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm004dz19eaq7d276m','cmdya56zm004cz19ezwg0m9s9','Загальмую жорсткіше - адреналін допоможе',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm004ez19el7ytqhjh','cmdya56zm004cz19ezwg0m9s9','Скоріш за все буду гальмувати як звик - м''яко',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm004fz19e7rlvgtg9','cmdya56zm004cz19ezwg0m9s9','Інстинкти підкажуть',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm004gz19ezngjf89z','cmdya56zm004cz19ezwg0m9s9','Не знаю, не було ситуацій',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm004iz19ehl6xh5u0','cmdya56zm004hz19ejryy5y1q','Розслаблено як завжди',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm004jz19efa8y9t4o','cmdya56zm004hz19ejryy5y1q','Міцно стиснути бак',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm004kz19e1yr9nz58','cmdya56zm004hz19ejryy5y1q','Розвести в сторони, для більшого супротиву повітря',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm004lz19epxjkcsbh','cmdya56zm004hz19ejryy5y1q','Не має значення',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm004nz19esvvuaazt','cmdya56zm004mz19ejrncwx07','Тільки в екстреній ситуації одночасно з переднім і зчепленням',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm004oz19ec14ecfe3','cmdya56zm004mz19ejrncwx07','При гальмуванні на поворотах',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm004pz19eqfp487g4','cmdya56zm004mz19ejrncwx07','При гальмуванні на слизькій дорозі',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm004qz19ennvflubq','cmdya56zm004mz19ejrncwx07','В міжрядді',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm004rz19eujude9de','cmdya56zm004mz19ejrncwx07','Завжди разом з переднім',1,4,NULL);
INSERT INTO Answer VALUES('cmdya56zm004tz19e9j3xr6vk','cmdya56zm004sz19eqqmr2ftk','Приблизно, їжджу по центру',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm004uz19e5gu7maqn','cmdya56zm004sz19eqqmr2ftk','Так, чітко, вузький вхід',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm004vz19e5sr09svk','cmdya56zm004sz19eqqmr2ftk','Так, чітко, широкий вхід',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm004xz19earpcjnan','cmdya56zm004wz19e3pfampvx','40-60 км/год',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm004yz19eobsng6do','cmdya56zm004wz19e3pfampvx','60-80 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm004zz19erdsnjcmk','cmdya56zm004wz19e3pfampvx','80-100 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0050z19e1m27y2nl','cmdya56zm004wz19e3pfampvx','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0052z19egxm0jmz0','cmdya56zm0051z19eddyvgldg','40-60 км/год',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0053z19e79264ebl','cmdya56zm0051z19eddyvgldg','60-80 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0054z19ehp62hq9b','cmdya56zm0051z19eddyvgldg','80-100 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm0055z19e6z684rxy','cmdya56zm0051z19eddyvgldg','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zm0057z19encgvzbwb','cmdya56zm0056z19e89eeueq9','Ні і це мене турбує',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm0058z19eagfc9va8','cmdya56zm0056z19e89eeueq9','Дуже приблизно',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zm0059z19eczrmr950','cmdya56zm0056z19e89eeueq9','Так, знаю точно',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zm005bz19eiry32hsd','cmdya56zm005az19eg1ya838c','Слабкі м''язи, треба в спортзал',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zm005cz19etoc33oe3','cmdya56zm005az19eg1ya838c','Слабо тримаюсь колінами',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn005dz19e25vi1uu7','cmdya56zm005az19eg1ya838c','Треба збільшувати кут нахилу',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn005ez19e7gsi3zmv','cmdya56zm005az19eg1ya838c','Неспортивне кермо, треба міняти',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn005gz19e08hmgdzg','cmdya56zn005fz19e6ndafe8n','Закрити газ',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn005hz19elk5q65hp','cmdya56zn005fz19e6ndafe8n','Відкрити газ',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn005iz19euh3deks4','cmdya56zn005fz19e6ndafe8n','Тримати газ без змін',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn005jz19exetza4uu','cmdya56zn005fz19e6ndafe8n','Притримати передній гальмо і молитися',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn005lz19e0vkf0daw','cmdya56zn005kz19emned8via','Продовжую як зазвичай, пісок не страшний',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn005mz19etkk23k6h','cmdya56zn005kz19emned8via','Максимально випрямляю мотоцикл перед піском',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn005nz19e264z6ytd','cmdya56zn005kz19emned8via','Гальмую переднім гальмом',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn005oz19e3u5pdnen','cmdya56zn005kz19emned8via','Гальмую заднім гальмом і зчепленням',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn005qz19e7g9x7akl','cmdya56zn005pz19e8e9k6j1p','До 40 км/год',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn005rz19e3agvstt9','cmdya56zn005pz19e8e9k6j1p','40-60 км/год',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn005sz19e42r8ivrm','cmdya56zn005pz19e8e9k6j1p','60-80 км/год',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn005tz19e35edz19x','cmdya56zn005pz19e8e9k6j1p','80-100 км/год',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn005uz19evmbg0d0t','cmdya56zn005pz19e8e9k6j1p','Чим швидше - тим міцніше',0,4,NULL);
INSERT INTO Answer VALUES('cmdya56zn005wz19ec33ttdl0','cmdya56zn005vz19ebp4195me','Вдень щоб мене бачили, вночі вимикаю',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn005xz19e37kccu66','cmdya56zn005vz19ebp4195me','І вдень і вночі = краще мене видно навіть якщо осліплю когось',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn005yz19e6b4eiaf9','cmdya56zn005vz19ebp4195me','Ніколи, в місті достатньо освітлення',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn005zz19eqvz46u4n','cmdya56zn005vz19ebp4195me','Тільки якщо вулиця пуста і темна',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn0061z19eklfvwp32','cmdya56zn0060z19e8fx994ea','Міцно, щоб контролювати',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn0062z19ewf60il3z','cmdya56zn0060z19e8fx994ea','Як тримаєш склянку кави',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn0063z19ev5zyhiie','cmdya56zn0060z19e8fx994ea','Залежить від дороги',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn0065z19e6xzkyc40','cmdya56zn0064z19eltu5y7p8','Ні, боюсь',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn0066z19ec7aex9sh','cmdya56zn0064z19eltu5y7p8','Рідко, некомфортно',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn0067z19eov5rspx4','cmdya56zn0064z19eltu5y7p8','Іноді, нормально',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn0068z19en4t392sa','cmdya56zn0064z19eltu5y7p8','Часто, комфортно',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn0069z19eh1x8sz5j','cmdya56zn0064z19eltu5y7p8','Постійно, як риба у воді',1,4,NULL);
INSERT INTO Answer VALUES('cmdya56zn006bz19eiomdo2p4','cmdya56zn006az19eji78k0ed','Проїду всіх і стану попереду',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn006cz19edtdwgqx4','cmdya56zn006az19eji78k0ed','Між машинами де є місце',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn006dz19ef7i9vu0o','cmdya56zn006az19eji78k0ed','Справа від крайньої лівої машини',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn006ez19ecj8xao6d','cmdya56zn006az19eji78k0ed','Справа від крайньої правої',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn006gz19ew2ljsoiy','cmdya56zn006fz19e436t3ccg','На поворотник - він же попереджує',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn006hz19eomuzd6ld','cmdya56zn006fz19e436t3ccg','На водія - чи дивиться в дзеркало',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn006iz19eqmmkmxpj','cmdya56zn006fz19e436t3ccg','На передні колеса - чи почали повертатись?',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn006jz19el6fvuoa2','cmdya56zn006fz19e436t3ccg','На тренд руху автівки',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn006lz19esan7wuf7','cmdya56zn006kz19et6hyrzuc','Зупинюсь і почекаю',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn006mz19escscptfr','cmdya56zn006kz19et6hyrzuc','Зробити перегазовку щоб він зрозумів',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn006nz19ergz72lyb','cmdya56zn006kz19et6hyrzuc','Посигналити делікатно',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn006oz19eyaqv6je6','cmdya56zn006kz19et6hyrzuc','Уйти в інший міжряддя',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn006qz19edrzk1jzp','cmdya56zn006pz19eqii5unmf','Їдемо між машиною і бордюром',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn006rz19ed48tby7f','cmdya56zn006pz19eqii5unmf','По тротуару',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn006sz19eqno0fx9s','cmdya56zn006pz19eqii5unmf','Почекати в потоці',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn006tz19ezr9bymoy','cmdya56zn006pz19eqii5unmf','Погазувати щоб пропустили',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn006vz19epq97wogp','cmdya56zn006uz19eot9ms1rq','Привітатись',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn006wz19e8etsdi44','cmdya56zn006uz19eot9ms1rq','Прискоритись щоб не обігнав',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn006xz19ebez41ft6','cmdya56zn006uz19eot9ms1rq','Перестроїтись і пропустити',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn006yz19ehtfnet21','cmdya56zn006uz19eot9ms1rq','Ігнорувати його',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn0070z19eejf6by90','cmdya56zn006zz19ezn3inj77','Щоб показати що вони ендуристи',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn0071z19erx2n33tl','cmdya56zn006zz19ezn3inj77','Щоб показати що вони власник BMW GS 1250',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn0072z19erfay7ytz','cmdya56zn006zz19ezn3inj77','Щоб розім''яти ноги',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn0073z19etuz4nuko','cmdya56zn006zz19ezn3inj77','Щоб бачити далі через машини',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn0074z19e844rqk7o','cmdya56zn006zz19ezn3inj77','Це круто виглядає',0,4,NULL);
INSERT INTO Answer VALUES('cmdya56zn0077z19ets2xcrhr','cmdya56zn0076z19etw0dv6l9','Міцно тримаю кермо і гальмую',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn0078z19eirs2deyz','cmdya56zn0076z19etw0dv6l9','Розслабляю руки, плавно відпускаю газ',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn0079z19eealfbehw','cmdya56zn0076z19etw0dv6l9','Різко закриваю газ',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn007az19esdorad8d','cmdya56zn0076z19etw0dv6l9','Додаю газу',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn007bz19e6h7dy0v7','cmdya56zn0076z19etw0dv6l9','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdya56zn007dz19e2nrnjzrh','cmdya56zn007cz19e3syrg7zf','Різко гальмувати',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn007ez19e2qvm82yw','cmdya56zn007cz19e3syrg7zf','Додати газу',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn007fz19eaz8ovuau','cmdya56zn007cz19e3syrg7zf','Випрямити мотоцикл, плавно закрити газ',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn007gz19epza766qt','cmdya56zn007cz19e3syrg7zf','Нічого не змінювати',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn007iz19e2qqpk6kd','cmdya56zn007hz19ex1prpwcw','На 20-30%',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn007jz19efd0zehln','cmdya56zn007hz19ex1prpwcw','В 1.25-1.5 рази',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn007kz19ew1wphavr','cmdya56zn007hz19ex1prpwcw','В 2-3 рази',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn007lz19ealn02suw','cmdya56zn007hz19ex1prpwcw','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn007nz19egvf20440','cmdya56zn007mz19eiu0vx8cv','Захист від подряпин колінами',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn007oz19euc97xqmt','cmdya56zn007mz19eiu0vx8cv','Захист від бензинових плям',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn007pz19eucz83q37','cmdya56zn007mz19eiu0vx8cv','Для зручності при гальмуванні',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn007qz19etko644h3','cmdya56zn007mz19eiu0vx8cv','Для більшого контролю ногами',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn007sz19eenl0kfq9','cmdya56zn007rz19esz4qj6hu','Круто, всі чують що я їду',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn007tz19ezgv3tua4','cmdya56zn007rz19esz4qj6hu','Безпека - гучний байк помітніший',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn007uz19em4prcyyv','cmdya56zn007rz19esz4qj6hu','Не люблю, це неповага до оточуючих',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn007vz19eoml60vpw','cmdya56zn007rz19esz4qj6hu','Використовую помірно гучну систему для безпеки',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn007xz19ef76a8kcb','cmdya56zn007wz19e5jl1djj1','Знаю точно і перевіряю регулярно',1,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn007yz19eqoe12kbz','cmdya56zn007wz19e5jl1djj1','Знаю приблизно',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn007zz19e2np4gc3y','cmdya56zn007wz19e5jl1djj1','Не знаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn0081z19eiii98wsg','cmdya56zn0080z19eu430i0sy','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn0082z19elay8a5ff','cmdya56zn0080z19eu430i0sy','Напевно',0,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn0083z19ex5q3v8oq','cmdya56zn0080z19eu430i0sy','Так, регулярно, їжджу по пробках',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn0084z19e8on6zdoq','cmdya56zn0080z19eu430i0sy','Так, регулярно, їздив в дощ і по холодному',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn0086z19e63nxuh10','cmdya56zn0085z19e37go8kdf','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn0087z19en8o2spzm','cmdya56zn0085z19e37go8kdf','Трохи джимхани',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn0088z19ebb0pz5v4','cmdya56zn0085z19e37go8kdf','Трохи треку',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn0089z19elum1v9qp','cmdya56zn0085z19e37go8kdf','Обидва напрямки',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn008bz19ee988z6sg','cmdya56zn008az19e21pbns6b','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn008cz19e0gcyc2f0','cmdya56zn008az19e21pbns6b','1-2 людини',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn008dz19e0h20g8tw','cmdya56zn008az19e21pbns6b','Кілька досвідчених',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn008ez19emx6654gg','cmdya56zn008az19e21pbns6b','Велика спільнота',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn008gz19et3ugt2th','cmdya56zn008fz19e8zqu24cu','Тільки сам',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn008hz19evzwbyhfj','cmdya56zn008fz19e8zqu24cu','Іноді з друзями',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn008iz19et8hz04tx','cmdya56zn008fz19e8zqu24cu','Регулярно в групі',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn008kz19e8uey93uf','cmdya56zn008jz19eqxdpos16','Нікого немає',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn008lz19evn006qnt','cmdya56zn008jz19eqxdpos16','Друзі',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn008mz19etadmmkdo','cmdya56zn008jz19eqxdpos16','Механік/СТО',1,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn008nz19ea4lqwrao','cmdya56zn008jz19eqxdpos16','Онлайн спільноти',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn008pz19e5itkwqmv','cmdya56zn008oz19eiofija16','Вони вже вміють',0,0,NULL);
INSERT INTO Answer VALUES('cmdya56zn008qz19evhcdbp1i','cmdya56zn008oz19eiofija16','Не треба бо вони вже можуть передбачити ситуацію',1,1,NULL);
INSERT INTO Answer VALUES('cmdya56zn008rz19ej3sers4k','cmdya56zn008oz19eiofija16','Бо можна впасти і подряпати дорогий байк',0,2,NULL);
INSERT INTO Answer VALUES('cmdya56zn008sz19eavf0bfxe','cmdya56zn008oz19eiofija16','Бояться, бо зі швидкості можна перекинутись через кермо і зламати шию',1,3,NULL);
INSERT INTO Answer VALUES('cmdya56zn008tz19eqv26ahwc','cmdya56zn008oz19eiofija16','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlny000az1m958tdybrh','cmdyrrlnx0008z1m9j7evnbgj','З дитинства мріяв',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlnz000cz1m9abxblwge','cmdyrrlnx0008z1m9j7evnbgj','Батько/мати мотоцикліст',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlnz000ez1m9h7ggbkzr','cmdyrrlnx0008z1m9j7evnbgj','Мене прокатили і я захотів',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlo0000gz1m98afo30uw','cmdyrrlnx0008z1m9j7evnbgj','Давно задивлявся, а тут можна вмерти а на мотоцику ще не покатався',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlo1000iz1m92gfcg2cf','cmdyrrlnx0008z1m9j7evnbgj','Свій варіант',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlo2000mz1m9gap11ecb','cmdyrrlo1000kz1m9o5xeghto','TheRiders',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlo3000oz1m9olxbzr4p','cmdyrrlo1000kz1m9o5xeghto','YellowRide',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlo3000qz1m9ky4acd20','cmdyrrlo1000kz1m9o5xeghto','ProBiker',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlo3000sz1m9f7o7w0vp','cmdyrrlo1000kz1m9o5xeghto','Freeride.kiev.ua',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlo4000uz1m9ljurtuid','cmdyrrlo1000kz1m9o5xeghto','Motostar',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlo4000wz1m92c2t4qwa','cmdyrrlo1000kz1m9o5xeghto','VShleme',0,5,NULL);
INSERT INTO Answer VALUES('cmdyrrlo5000yz1m9q4a583qb','cmdyrrlo1000kz1m9o5xeghto','Сам навчався',0,6,NULL);
INSERT INTO Answer VALUES('cmdyrrlo50010z1m9v7udr33z','cmdyrrlo1000kz1m9o5xeghto','Друг навчив',0,7,NULL);
INSERT INTO Answer VALUES('cmdyrrlo60012z1m9u4gp1xw8','cmdyrrlo1000kz1m9o5xeghto','Інше',0,8,NULL);
INSERT INTO Answer VALUES('cmdyrrlo80018z1m9u08vwcqy','cmdyrrlo70016z1m9jfoyeght','Ще не почав або перший сезон',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlo9001az1m9ie4mn9vd','cmdyrrlo70016z1m9jfoyeght','2-3 сезони',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrloa001cz1m9nuhfdeny','cmdyrrlo70016z1m9jfoyeght','3-7 сезонів',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlob001ez1m9ah7v9h2u','cmdyrrlo70016z1m9jfoyeght','7+ сезонів',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlof001oz1m9hv09obqv','cmdyrrloe001mz1m9st4s7x52','Ще не було складних',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlof001qz1m9hn941xjj','cmdyrrloe001mz1m9st4s7x52','Екстрене гальмування',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlog001sz1m9lr1lvv98','cmdyrrloe001mz1m9st4s7x52','Уникнення від перестроювання маневром',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlog001uz1m9oy5uj4es','cmdyrrloe001mz1m9st4s7x52','Втрата балансу/падіння',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrloh001wz1m9onxl4rlp','cmdyrrloe001mz1m9st4s7x52','Багато вже було (5+)',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrloi0020z1m96pp3htwa','cmdyrrloh001yz1m93ik6uvb3','Жодної',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrloi0022z1m9dasmoatt','cmdyrrloh001yz1m93ik6uvb3','1-2 за сезон',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrloj0024z1m936zgjefa','cmdyrrloh001yz1m93ik6uvb3','3-5 за сезон',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrloj0026z1m961ffw2h3','cmdyrrloh001yz1m93ik6uvb3','Більше 5 за сезон',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlok0028z1m9f7jchtlr','cmdyrrloh001yz1m93ik6uvb3','Не рахую',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlol002ez1m9hresh9lp','cmdyrrlol002cz1m9x0u03cpx','Так, авжеж, розумію ризики',1,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlom002gz1m9eefsj068','cmdyrrlol002cz1m9x0u03cpx','Досить нав''язлива думка, думаю часто',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlom002iz1m9x3dlsevn','cmdyrrlol002cz1m9x0u03cpx','Ні, зі мною цього не станеться',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlon002mz1m9bzo8wube','cmdyrrlon002kz1m9wp1dmqp3','Щільні затори і міжряддя',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrloo002oz1m9cernnd8u','cmdyrrlon002kz1m9wp1dmqp3','Маневри на низькій швидкості, розвороти на вузькій дорозі',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrloo002qz1m9ewmpju50','cmdyrrlon002kz1m9wp1dmqp3','Небезпечні маневри інших водіїв',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlop002sz1m97gxm78a2','cmdyrrlon002kz1m9wp1dmqp3','Лякає екстрене гальмування зі швидкості',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlop002uz1m9ebwq88s4','cmdyrrlon002kz1m9wp1dmqp3','Рейки, слизьке',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlop002wz1m9t7mr1g89','cmdyrrlon002kz1m9wp1dmqp3','Раптові ями або зрізаний асфальт',0,5,NULL);
INSERT INTO Answer VALUES('cmdyrrloq002yz1m9cpssvfkv','cmdyrrlon002kz1m9wp1dmqp3','Непрогнозовані дії водіїв',0,6,NULL);
INSERT INTO Answer VALUES('cmdyrrlor0032z1m9vr05khzi','cmdyrrloq0030z1m9275prczv','Ось я тут на тесті, поки це все',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlor0034z1m9yhsl7cer','cmdyrrloq0030z1m9275prczv','Купив якісну екіпіровку',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlos0036z1m9qkgz7vdp','cmdyrrloq0030z1m9275prczv','Дивився аварії в YouTube',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlos0038z1m9sttkkcc3','cmdyrrloq0030z1m9275prczv','Дивився БАГАТО аварій в YouTube (50+)',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlot003az1m9pwzh9d41','cmdyrrloq0030z1m9275prczv','Тренував гальмування',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlot003cz1m9i0jj1a54','cmdyrrloq0030z1m9275prczv','Джимхана',0,5,NULL);
INSERT INTO Answer VALUES('cmdyrrlot003ez1m9zmf9kyjz','cmdyrrloq0030z1m9275prczv','Їздив по ґрунту/офроуд',0,6,NULL);
INSERT INTO Answer VALUES('cmdyrrlou003gz1m92qwcagmd','cmdyrrloq0030z1m9275prczv','Читав літературу/статті',0,7,NULL);
INSERT INTO Answer VALUES('cmdyrrlov003kz1m9btz83zrb','cmdyrrlou003iz1m9pdw09903','Стою в потоці як всі',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlov003mz1m9le5rz07w','cmdyrrlou003iz1m9pdw09903','Проїжджаю вперед і стаю попереду',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlow003oz1m9icumifys','cmdyrrlou003iz1m9pdw09903','Стою з готовністю втекти',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlow003qz1m9dzdwqjfh','cmdyrrlou003iz1m9pdw09903','Контролюю дзеркала на випадок удару ззаду',1,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlox003uz1m9m9dr20dc','cmdyrrlox003sz1m9heunvf1r','По центру',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlox003wz1m94thkcucl','cmdyrrlox003sz1m9heunvf1r','Лівий край',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrloy003yz1m99uifsmf3','cmdyrrlox003sz1m9heunvf1r','Правий край',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrloy0040z1m96cq9t4l7','cmdyrrlox003sz1m9heunvf1r','Постійно змінюю позицію залежно від ситуації',1,3,NULL);
INSERT INTO Answer VALUES('cmdyrrloz0044z1m9q5ew847n','cmdyrrloz0042z1m9hfvqyak5','Удар ззаду',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlp00046z1m9upos99c6','cmdyrrloz0042z1m9hfvqyak5','Перестроювання без поворотників',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlp00048z1m9tz6hovqi','cmdyrrloz0042z1m9hfvqyak5','Несподівані розвороти',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlp1004az1m9af4hgtwc','cmdyrrloz0042z1m9hfvqyak5','Лівий поворот назустріч',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlp1004cz1m9u2h8c6f7','cmdyrrloz0042z1m9hfvqyak5','Виїзди з прилеглих',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlp2004ez1m9toop6wup','cmdyrrloz0042z1m9hfvqyak5','Пішоходи',0,5,NULL);
INSERT INTO Answer VALUES('cmdyrrlp2004gz1m9olnxpu8v','cmdyrrloz0042z1m9hfvqyak5','Відкриття дверей',0,6,NULL);
INSERT INTO Answer VALUES('cmdyrrlp3004kz1m9ozqoyb0q','cmdyrrlp3004iz1m9d2j7ortw','Боюсь, не їжджу',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlp4004mz1m92xybix3d','cmdyrrlp3004iz1m9d2j7ortw','Складно, некомфортно',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlp4004oz1m9il3t8f8x','cmdyrrlp3004iz1m9d2j7ortw','Нормально, але напружено',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlp4004qz1m9pwfht0rf','cmdyrrlp3004iz1m9d2j7ortw','Легко, комфортно',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlp5004sz1m9jgu6g5tp','cmdyrrlp3004iz1m9d2j7ortw','Дуже легко, як риба у воді',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlp6004wz1m9txdlbr0w','cmdyrrlp5004uz1m9cilm79h5','До 20 км/год',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlp6004yz1m947765acw','cmdyrrlp5004uz1m9cilm79h5','20-40 км/год',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlp70050z1m965l33fjw','cmdyrrlp5004uz1m9cilm79h5','40-60 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlp70052z1m96n6k6p8f','cmdyrrlp5004uz1m9cilm79h5','Швидше 60 км/год',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlp80056z1m9klpsg7pl','cmdyrrlp70054z1m9wmm8zh61','Заднім гальмом',1,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlp80058z1m9o5cmgtm1','cmdyrrlp70054z1m9wmm8zh61','Зчепленням',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlp8005az1m9x6ald6km','cmdyrrlp70054z1m9wmm8zh61','Переднім гальмом',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlp9005cz1m91mvdpqsf','cmdyrrlp70054z1m9wmm8zh61','Комбіновано задній+зчеплення',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpa005gz1m904fqk472','cmdyrrlp9005ez1m9cuwturjo','Поворотники',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpa005iz1m9hpoh3rbd','cmdyrrlp9005ez1m9cuwturjo','Передні колеса машин',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpa005kz1m9za98na6r','cmdyrrlp9005ez1m9cuwturjo','Голови водіїв в дзеркалах',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpb005mz1m9jejm6s0v','cmdyrrlp9005ez1m9cuwturjo','Загальний тренд руху авто',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpb005oz1m93ybcz34g','cmdyrrlp9005ez1m9cuwturjo','Все вище одночасно',1,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlpc005sz1m9ivpx088h','cmdyrrlpc005qz1m9euhhdvcb','До 60 км/год',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpc005uz1m9h3kf7v48','cmdyrrlpc005qz1m9euhhdvcb','60-80 км/год',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpd005wz1m9w28pp3j3','cmdyrrlpc005qz1m9euhhdvcb','80-100 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpd005yz1m9oiislowl','cmdyrrlpc005qz1m9euhhdvcb','100-120 км/год',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpe0060z1m9euayuka2','cmdyrrlpc005qz1m9euhhdvcb','Швидше 120',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlpf0064z1m9ancqb8hu','cmdyrrlpe0062z1m9luanwjq3','В основному заднім',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpf0066z1m9wosyz8q3','cmdyrrlpe0062z1m9luanwjq3','В основному переднім',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpf0068z1m9kg1af6s2','cmdyrrlpe0062z1m9luanwjq3','Обома одночасно',1,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpg006az1m9zzf1jl9k','cmdyrrlpe0062z1m9luanwjq3','Залежить від ситуації',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpg006ez1m9z2t1bdgf','cmdyrrlpg006cz1m9jsgw8lt0','20-25 м',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlph006gz1m9tppo9fp8','cmdyrrlpg006cz1m9jsgw8lt0','30-35 м',1,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlph006iz1m9919df5xj','cmdyrrlpg006cz1m9jsgw8lt0','40-45 м',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpi006kz1m9shlglg1l','cmdyrrlpg006cz1m9jsgw8lt0','50+ м',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpi006mz1m97s1lrukf','cmdyrrlpg006cz1m9jsgw8lt0','Не знаю',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlpj006qz1m93anaaqhq','cmdyrrlpi006oz1m9d083s0lh','Ні, ніколи',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpj006sz1m9iclw5j8k','cmdyrrlpi006oz1m9d083s0lh','Так, заднє',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpj006uz1m91kfw8qpw','cmdyrrlpi006oz1m9d083s0lh','Так, переднє',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpk006wz1m9ieo0hkv7','cmdyrrlpi006oz1m9d083s0lh','Обидва блокував',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpl0070z1m924za9yz9','cmdyrrlpk006yz1m9r4nqtce8','Тримати гальмо далі',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpl0072z1m9i7u45rjk','cmdyrrlpk006yz1m9r4nqtce8','Відпустити гальмо миттєво',1,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpm0074z1m9v8o0895c','cmdyrrlpk006yz1m9r4nqtce8','Додати заднє гальмо',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpm0076z1m9yb2o10em','cmdyrrlpk006yz1m9r4nqtce8','Вижати зчеплення',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpn007az1m9bjpnar01','cmdyrrlpm0078z1m9qp2fwepa','Нічого, якщо правильно',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpn007cz1m9usr5w8c7','cmdyrrlpm0078z1m9qp2fwepa','Мотоцикл випрямиться, можливий highside',1,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpn007ez1m934s9xrl0','cmdyrrlpm0078z1m9qp2fwepa','Впаду',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpo007gz1m95ftsqkxl','cmdyrrlpm0078z1m9qp2fwepa','Залежить від швидкості',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpo007kz1m92apzaj0d','cmdyrrlpo007iz1m962vwnafd','Так, регулярно',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpp007mz1m90u3z1j3k','cmdyrrlpo007iz1m962vwnafd','Кілька разів',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpp007oz1m9q07csszj','cmdyrrlpo007iz1m962vwnafd','Ні, уникаю дощу',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpq007qz1m95lv7hngb','cmdyrrlpo007iz1m962vwnafd','Ще не доводилось',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpq007uz1m9tt2n7qw1','cmdyrrlpq007sz1m9z1nwke3j','Завжди - це основні гальма',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpr007wz1m9e6shoor0','cmdyrrlpq007sz1m9z1nwke3j','Тільки в екстреній ситуації разом з переднім',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpr007yz1m94ymkq696','cmdyrrlpq007sz1m9z1nwke3j','При гальмуванні на поворотах',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpr0080z1m9wjtps0wk','cmdyrrlpq007sz1m9z1nwke3j','При гальмуванні на слизькій дорозі',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlps0082z1m9jmskbunp','cmdyrrlpq007sz1m9z1nwke3j','В міжрядді',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlps0084z1m9y8x3byw8','cmdyrrlpq007sz1m9z1nwke3j','Майже не використовую',0,5,NULL);
INSERT INTO Answer VALUES('cmdyrrlpt0088z1m9woqkl5q4','cmdyrrlps0086z1m9p8kktbpz','Так, дуже боюсь',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpt008az1m9f78znlvz','cmdyrrlps0086z1m9p8kktbpz','Трохи некомфортно',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpu008cz1m96zr3w7p3','cmdyrrlps0086z1m9p8kktbpz','Ні, нормально роблю',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpu008ez1m9e1l7ybgy','cmdyrrlps0086z1m9p8kktbpz','Що це таке?',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpv008iz1m9xfdhj3ns','cmdyrrlpu008gz1m9v8v8oyyn','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpv008kz1m92kjd81al','cmdyrrlpu008gz1m9v8v8oyyn','Трохи джимхани',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpv008mz1m9gqyc94kw','cmdyrrlpu008gz1m9v8v8oyyn','Трохи треку',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpw008oz1m9v0e5i2om','cmdyrrlpu008gz1m9v8v8oyyn','Обидва регулярно',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpx008sz1m93kiyablt','cmdyrrlpw008qz1m98o57k3ta','Так, точно знаю',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpx008uz1m9s2tkt0rn','cmdyrrlpw008qz1m98o57k3ta','Приблизно уявляю',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpx008wz1m9awai0f29','cmdyrrlpw008qz1m98o57k3ta','Ні, не знаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlpy008yz1m9r253ysae','cmdyrrlpw008qz1m98o57k3ta','Не розумію про що мова',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlpz0092z1m9ran6zljs','cmdyrrlpy0090z1m9ix3kdmg9','Обережно по центру',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlpz0094z1m972efnjkx','cmdyrrlpy0090z1m9ix3kdmg9','Вузький вхід, широкий вихід',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlpz0096z1m9hzjqlr5m','cmdyrrlpy0090z1m9ix3kdmg9','Широкий вхід, вузький вихід',1,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlq00098z1m93eyp44u3','cmdyrrlpy0090z1m9ix3kdmg9','Не звертаю уваги на траєкторію',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlq0009cz1m9u5jor25b','cmdyrrlq0009az1m9z2ao05qv','Не знаю, треба пробувати',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlq1009ez1m92hcindq1','cmdyrrlq0009az1m9z2ao05qv','Випрямляю і гальмую по прямій',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlq1009gz1m9a27j9fnj','cmdyrrlq0009az1m9z2ao05qv','Використовую тільки заднє',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlq2009iz1m98ecvd9jo','cmdyrrlq0009az1m9z2ao05qv','Розумію trail braking',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlq2009mz1m9k3n2yqrc','cmdyrrlq2009kz1m9o3rp5yi8','40-60 км/год',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlq3009oz1m96f82hx6g','cmdyrrlq2009kz1m9o3rp5yi8','60-80 км/год',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlq3009qz1m9bxw9w97u','cmdyrrlq2009kz1m9o3rp5yi8','80-100 км/год',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlq3009sz1m92sc4fwx0','cmdyrrlq2009kz1m9o3rp5yi8','Не знаю',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlq4009wz1m9xmc0p26c','cmdyrrlq4009uz1m9qixzifa4','Так, боюсь що впаду',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlq5009yz1m9kxvsgxlf','cmdyrrlq4009uz1m9qixzifa4','Трохи напружуюсь',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlq500a0z1m99p2z6vae','cmdyrrlq4009uz1m9qixzifa4','Ні, комфортно',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlq500a2z1m96t0u611g','cmdyrrlq4009uz1m9qixzifa4','Люблю агресивні повороти',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlq600a6z1m9iukxg3xu','cmdyrrlq600a4z1m9p9bt1k9t','Вдень включаю, вночі ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlq700a8z1m9nnjgyh3u','cmdyrrlq600a4z1m9p9bt1k9t','Завжди включене',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlq700aaz1m9czpt6mn6','cmdyrrlq600a4z1m9p9bt1k9t','Ніколи не включаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlq700acz1m9lzznrrlv','cmdyrrlq600a4z1m9p9bt1k9t','Тільки коли темно і пусто',1,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlq800agz1m9muejfg87','cmdyrrlq800aez1m9lzxv1ifh','Міцно, щоб контролювати',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlq800aiz1m9ygupsnzn','cmdyrrlq800aez1m9lzxv1ifh','Як тримаю склянку кави',1,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlq900akz1m9r44iwqrg','cmdyrrlq800aez1m9lzxv1ifh','Залежить від ситуації',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlq900aoz1m98nnb7r77','cmdyrrlq900amz1m99axpsuzw','Проїжджаю всіх вперед',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqa00aqz1m9y5k4nodm','cmdyrrlq900amz1m99axpsuzw','Між машинами де є місце',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqa00asz1m966k1s7of','cmdyrrlq900amz1m99axpsuzw','Справа від крайньої лівої',1,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqb00auz1m90p0hqljh','cmdyrrlq900amz1m99axpsuzw','Залишаюсь в потоці',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlqb00ayz1m9qjt9y2gl','cmdyrrlqb00awz1m9v6ifjgw9','Показати що ендуристи',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqc00b0z1m9qt5w0zjz','cmdyrrlqb00awz1m9v6ifjgw9','Розім''яти ноги',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqc00b2z1m9g6d80u5d','cmdyrrlqb00awz1m9v6ifjgw9','Бачити далі через машини',1,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqc00b4z1m94b57lxyc','cmdyrrlqb00awz1m9v6ifjgw9','Круто виглядає',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlqd00b6z1m9sg0vgevt','cmdyrrlqb00awz1m9v6ifjgw9','Легше керувати на малій швидкості',0,4,NULL);
INSERT INTO Answer VALUES('cmdyrrlqd00baz1m9yl39jk6r','cmdyrrlqd00b8z1m9o6rfbpla','Захист від подряпин',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqe00bcz1m93897v740','cmdyrrlqd00b8z1m9o6rfbpla','Від бензинових плям',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqe00bez1m95b3amry4','cmdyrrlqd00b8z1m9o6rfbpla','Для контролю при гальмуванні',1,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqf00bgz1m997i5dnz8','cmdyrrlqd00b8z1m9o6rfbpla','Для кращого контролю ногами',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlqg00bkz1m9wgggdwgp','cmdyrrlqf00biz1m9znf9ybrl','Так, підлаштовуюсь',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqg00bmz1m98ygec6j5','cmdyrrlqf00biz1m9znf9ybrl','Ні, їжджу своїм темпом',1,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqg00boz1m9mcgh6zmq','cmdyrrlqf00biz1m9znf9ybrl','Не їжджу в групах',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqh00bsz1m9synym21y','cmdyrrlqh00bqz1m9jsb0fpaj','Так, регулярно',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqh00buz1m9xzd2fotk','cmdyrrlqh00bqz1m9jsb0fpaj','Кілька разів',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqi00bwz1m91qdc53wk','cmdyrrlqh00bqz1m9jsb0fpaj','Ще ні',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqi00byz1m9ub8nqfix','cmdyrrlqh00bqz1m9jsb0fpaj','Принципово соло',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlqj00c2z1m94lb1hdlz','cmdyrrlqj00c0z1m9f2j7akn5','Знаю точно (вкажіть нижче)',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqj00c4z1m9rwg4m131','cmdyrrlqj00c0z1m9f2j7akn5','Приблизно знаю',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqk00c6z1m9bgomb3do','cmdyrrlqj00c0z1m9f2j7akn5','Не знаю',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqk00caz1m9nze6e66y','cmdyrrlqk00c8z1m9te8amehr','Так, постійний',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlql00ccz1m9qjifdoqq','cmdyrrlqk00c8z1m9te8amehr','Іноді звертаюсь',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlql00cez1m91ylqnlo0','cmdyrrlqk00c8z1m9te8amehr','Сам обслуговую',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlql00cgz1m9ihlofdf4','cmdyrrlqk00c8z1m9te8amehr','Поки не потрібно було',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlqm00ckz1m9b69xtxmy','cmdyrrlqm00ciz1m9rtzr7g1t','Ні',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqn00cmz1m9grk6pbca','cmdyrrlqm00ciz1m9rtzr7g1t','Трохи (дощ, холод)',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqn00coz1m9ma5seoqg','cmdyrrlqm00ciz1m9rtzr7g1t','Регулярно всепогодний',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqo00csz1m9qadet1lw','cmdyrrlqn00cqz1m9jtmwhuw2','Так, для аналізу',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqo00cuz1m9i2o5mkfz','cmdyrrlqn00cqz1m9jtmwhuw2','Так, для безпеки',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqp00cwz1m9tumuflpe','cmdyrrlqn00cqz1m9jtmwhuw2','Іноді',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqp00cyz1m9zl1k1vv5','cmdyrrlqn00cqz1m9jtmwhuw2','Ні',0,3,NULL);
INSERT INTO Answer VALUES('cmdyrrlqq00d2z1m9rwokgywp','cmdyrrlqp00d0z1m9x14cpbpk','Завжди',0,0,NULL);
INSERT INTO Answer VALUES('cmdyrrlqq00d4z1m9jhcz4s1y','cmdyrrlqp00d0z1m9x14cpbpk','Для далеких поїздок',0,1,NULL);
INSERT INTO Answer VALUES('cmdyrrlqr00d6z1m9eam3cz1i','cmdyrrlqp00d0z1m9x14cpbpk','Рідко',0,2,NULL);
INSERT INTO Answer VALUES('cmdyrrlqr00d8z1m9podup4jd','cmdyrrlqp00d0z1m9x14cpbpk','Ніколи',0,3,NULL);
CREATE TABLE IF NOT EXISTS "UserProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "contentId" TEXT,
    "lessonId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "lastAccessedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "timeViewed" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO UserProgress VALUES('cmd2zn10l001qz16zubdjk0yt','cmd2zn0gg0005z16z4m78um6c','cmd2zn1090019z16zx15fn2ql',NULL,'COMPLETED',100,0,1752490573797,1752490573796,1752490573797,600,600,1752490573797,1);
CREATE TABLE IF NOT EXISTS "TestResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "points" INTEGER NOT NULL,
    "maxPoints" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "completedAt" DATETIME NOT NULL,
    "timeSpent" INTEGER NOT NULL, "competencyLevel" INTEGER, "knowledgeGaps" TEXT, "questionsAnswered" INTEGER, "recommendations" TEXT,
    CONSTRAINT "TestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO TestResult VALUES('cmdxl693m000hz15bsmz972u8','cmd2zn03b0000z16zz3riko5y','cmdxjsv1b0000z1549bqlyog7',0,0,0,204,1754338821954,1754340727954,1906,NULL,NULL,NULL,NULL);
INSERT INTO TestResult VALUES('cmdxl693n000jz15b85vn27kx','cmd2zn03b0000z16zz3riko5y','cmdxjsv1b0000z1549bqlyog7',0,0,0,204,1754338821955,1754340727955,1906,NULL,NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS "UserAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testResultId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "textAnswer" TEXT,
    "orderAnswer" TEXT,
    "matchingAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "pointsEarned" INTEGER NOT NULL,
    "timeSpent" INTEGER,
    CONSTRAINT "UserAnswer_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "courseId" TEXT,
    "testResultId" TEXT,
    "certificateNumber" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "metadata" JSONB,
    "fileUrl" TEXT,
    CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Certificate_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "trialEndsAt" DATETIME,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "channels" TEXT NOT NULL DEFAULT '["in_app"]',
    "deliveryStatus" TEXT NOT NULL DEFAULT '{"in_app": "delivered"}',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "emailSentAt" DATETIME,
    "emailOpenedAt" DATETIME,
    "pushSentAt" DATETIME,
    "pushClickedAt" DATETIME,
    "expiresAt" DATETIME,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "KBNebSync" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "totalFiles" INTEGER NOT NULL DEFAULT 0,
    "processedFiles" INTEGER NOT NULL DEFAULT 0,
    "importedFiles" INTEGER NOT NULL DEFAULT 0,
    "errorFiles" INTEGER NOT NULL DEFAULT 0,
    "errorLog" TEXT
);
CREATE TABLE IF NOT EXISTS "KBNebSyncItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "syncId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "contentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KBNebSyncItem_syncId_fkey" FOREIGN KEY ("syncId") REFERENCES "KBNebSync" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 10,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "criteria" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Achievement VALUES('cmd2zn101000qz16z5znrrxon','first_visit','👋','LEARNING',10,0,1,'{"type":"first_login"}',1752490573777,1752490573777);
INSERT INTO Achievement VALUES('cmd2zn101000rz16z501qf8jk','five_topics_complete','📚','LEARNING',50,0,1,'{"type":"content_complete","count":5}',1752490573777,1752490573777);
INSERT INTO Achievement VALUES('cmd2zn101000sz16zlbbtz8vv','first_topic_complete','🎯','LEARNING',20,0,1,'{"type":"content_complete","count":1}',1752490573777,1752490573777);
CREATE TABLE IF NOT EXISTS "AchievementTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "achievementId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "AchievementTranslation_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO AchievementTranslation VALUES('cmd2zn101000tz16z47g3o21r','cmd2zn101000qz16z5znrrxon','UA','Перший візит','Вітаємо в системі навчання!');
INSERT INTO AchievementTranslation VALUES('cmd2zn101000uz16zzpgljh8y','cmd2zn101000qz16z5znrrxon','EN','First Visit','Welcome to the learning system!');
INSERT INTO AchievementTranslation VALUES('cmd2zn101000vz16zory86wjx','cmd2zn101000rz16z501qf8jk','UA','П''ять тем','Завершіть 5 тем навчання');
INSERT INTO AchievementTranslation VALUES('cmd2zn101000xz16zhof3najb','cmd2zn101000rz16z501qf8jk','EN','Five Topics','Complete 5 learning topics');
INSERT INTO AchievementTranslation VALUES('cmd2zn101000wz16z6qf2krgu','cmd2zn101000sz16zlbbtz8vv','UA','Перша тема','Завершіть вашу першу тему');
INSERT INTO AchievementTranslation VALUES('cmd2zn101000yz16zt8sm8cuo','cmd2zn101000sz16zlbbtz8vv','EN','First Topic','Complete your first topic');
CREATE TABLE IF NOT EXISTS "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "contentId" TEXT,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 15,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "prerequisites" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lesson_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CourseSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Lesson_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "LessonTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "objectives" TEXT,
    CONSTRAINT "LessonTranslation_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "author" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'YOUTUBE',
    "sourceUrl" TEXT,
    "videoTitle" TEXT,
    "imageUrl" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Testimonial VALUES('cmdk6a7w50000z1yqy45mk93b','Максим Петренко','Після твого курсу я нарешті перестав боятися повороту наліво! Раніше це був кошмар, а тепер роблю впевнено. Дякую за детальне пояснення концепції Vision/Blocker!','STUDENT_SUCCESS','YOUTUBE','https://youtube.com/watch?v=example1','8 концептів безпечного водіння мотоцикла',NULL,245,1731628800000,1,1,1,1753529658485,1753529658485);
INSERT INTO Testimonial VALUES('cmdk6a7w60001z1yqhzfc2zjp','Андрій Коваленко','Блін, чувак, ти врятував мені життя! Вчора використав твою пораду про планування траєкторії - уникнув зіткнення з авто, яке різко перестроїлось. Респект!','SAFETY_STORY','YOUTUBE','https://youtube.com/watch?v=example2','Як не потрапити в ДТП на мотоциклі',NULL,189,1730073600000,1,1,2,1753529658486,1753529658486);
INSERT INTO Testimonial VALUES('cmdk6a7w60002z1yqtecm9gfp','Олександр Шевченко','3 роки їжджу, думав все знаю. Подивився твої відео - зрозумів що був дурнем. Переглянув всі концепти, тепер відчуваю себе набагато впевненіше на дорозі.','EXPERIENCED_RIDER','YOUTUBE','https://youtube.com/watch?v=example3','Помилки досвідчених мотоциклістів',NULL,156,1726790400000,1,0,3,1753529658487,1753529658487);
INSERT INTO Testimonial VALUES('cmdk6a7w70003z1yq9kdhy8k9','Вікторія Мельник','Дівчата, не бійтеся мотоциклів! Пройшла курс Небачіва - тепер катаюсь з задоволенням. Особливо допомогли уроки про правильну посадку та контроль газу.','BEGINNER_SUCCESS','YOUTUBE','https://youtube.com/watch?v=example4','Мотоцикл для початківців',NULL,298,1733011200000,1,1,4,1753529658487,1753529658487);
INSERT INTO Testimonial VALUES('cmdk6a7w80004z1yqtqtkscg7','Ігор Бондаренко','Після аварії боявся сідати на мот. Твої відео про психологію водіння допомогли повернути впевненість. Тепер знову в сідлі, але вже з правильним підходом.','COMEBACK_STORY','YOUTUBE','https://youtube.com/watch?v=example5','Психологія безпечного водіння',NULL,134,1723248000000,1,0,5,1753529658488,1753529658488);
INSERT INTO Testimonial VALUES('cmdk6a7w80005z1yq6e6okcfl','Юрій Савченко','Мотошкола дала базу, але твої концепти - це next level! Особливо порадило про читання трафіку. Тепер бачу небезпеку за 3-4 машини наперед.','SKILL_IMPROVEMENT','YOUTUBE','https://youtube.com/watch?v=example6','Читання дорожньої ситуації',NULL,178,1730764800000,1,0,6,1753529658489,1753529658489);
INSERT INTO Testimonial VALUES('cmdk6a7w90006z1yqppj5hleh','Дмитро Ткаченко','Купив спортбайк, думав буду літати. Подивився твої відео про контроль - зрозумів що спочатку треба навчитись. Дякую що відкрив очі!','MINDSET_CHANGE','YOUTUBE','https://youtube.com/watch?v=example7','Спортбайк для початківців',NULL,203,1728950400000,1,0,7,1753529658489,1753529658489);
INSERT INTO Testimonial VALUES('cmdk6a7w90007z1yqmabba7b9','Сергій Морозов','Їжджу 10 років, але твоя подача матеріалу - це щось! Навіть досвідчений райдер знайде щось нове. Підписався, чекаю нових відео.','EXPERIENCED_RIDER','YOUTUBE','https://youtube.com/watch?v=example8','Техніка досвідчених райдерів',NULL,145,1725494400000,1,0,8,1753529658489,1753529658489);
INSERT INTO Testimonial VALUES('cmdk6a7w90008z1yqcdhq7dmh','Наталія Козак','Чоловік подарував мотоцикл, я в шоці була. Але твої уроки допомогли! Особливо про баланс на малій швидкості - це було моєю проблемою №1.','BEGINNER_SUCCESS','YOUTUBE','https://youtube.com/watch?v=example9','Баланс та контроль мотоцикла',NULL,267,1733788800000,1,0,9,1753529658490,1753529658490);
INSERT INTO Testimonial VALUES('cmdk6a7wb0009z1yqu6bcv5ui','Антон Левченко','Хлопці з мотоклубу порадили твій канал. Не пожалів! Концепція Т-CLOCS врятувала мене від поломки на трасі - помітив проблему з гальмами вчасно.','SAFETY_STORY','YOUTUBE','https://youtube.com/watch?v=example10','Передрейсовий огляд мотоцикла',NULL,122,1721865600000,1,0,10,1753529658491,1753529658491);
INSERT INTO Testimonial VALUES('cmdk6a7wb000az1yqit22rzrg','Роман Гриценко','Дивився всі твої стріми - це краще ніж будь-яка мотошкола! Реальні ситуації, реальні поради. Навчився більше ніж за 2 роки катання.','SKILL_IMPROVEMENT','YOUTUBE','https://youtube.com/watch?v=example11','Стрім: Розбір ДТП',NULL,234,1732060800000,1,1,11,1753529658491,1753529658491);
INSERT INTO Testimonial VALUES('cmdk6a7wb000bz1yqwtpubbug','Павло Дорошенко','Після твого курсу про гальмування врятував себе і пасажира. Машина вилетіла з парковки, встиг зупинитись за метр. Техніка працює!','SAFETY_STORY','YOUTUBE','https://youtube.com/watch?v=example12','Екстрене гальмування на мотоциклі',NULL,312,1733356800000,1,1,12,1753529658492,1753529658492);
INSERT INTO Testimonial VALUES('cmdk6a7wc000cz1yq4i4um8e3','moto_kyiv_rider','Брате, твої сторіз про blind spots врятували мене сьогодні! Маршрутка просто вивернула без повороту. Я вже був готовий 💪','SAFETY_STORY','INSTAGRAM','https://instagram.com/p/example1',NULL,NULL,89,1732752000000,1,0,13,1753529658492,1753529658492);
INSERT INTO Testimonial VALUES('cmdk6a7wc000dz1yqxdg05ubn','rider_girl_ua','Дякую за пост про екіпірування! Купила все по твоїм рекомендаціям. Вчора впала на тренуванні - навіть синців нема 😊','EQUIPMENT_ADVICE','INSTAGRAM','https://instagram.com/p/example2',NULL,NULL,156,1729382400000,1,0,14,1753529658493,1753529658493);
INSERT INTO Testimonial VALUES('cmdk6a7wd000ez1yqmn3lyocm','enduro_life_ua','Думав твої поради тільки для вулиці, але концепція Vision відмінно працює і в ендуро! Тепер бачу траєкторію на 3 повороти вперед 🔥','SKILL_IMPROVEMENT','INSTAGRAM','https://instagram.com/p/example3',NULL,NULL,178,1726358400000,1,0,15,1753529658493,1753529658493);
CREATE TABLE IF NOT EXISTS "UserUnlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    CONSTRAINT "UserUnlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Waitlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'promo_landing',
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Waitlist VALUES('cmd4iydqv00008oxjtupkxd7k','motochyn@gmail.com','landing_page','{}',1752583482391,1752583482391);
CREATE TABLE IF NOT EXISTS "AIUsageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL,
    "requestData" JSONB,
    "responseData" JSONB,
    "errorMessage" TEXT,
    "duration" INTEGER,
    "estimatedCost" REAL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "StaticPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "showInNavigation" BOOLEAN NOT NULL DEFAULT true,
    "allowComments" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "featuredImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StaticPage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "StaticPage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO StaticPage VALUES('cmd2zonmz0000z1erwwo7860o','about',NULL,0,1,1,1,1,NULL,NULL,NULL,1752490649772,1752490649772);
INSERT INTO StaticPage VALUES('cmd2zonn20003z1ermsa0a6zx','how-it-works',NULL,0,1,2,1,1,NULL,NULL,NULL,1752490649774,1752490649774);
INSERT INTO StaticPage VALUES('cmd2zonn20005z1erobhzesm9','pricing',NULL,0,1,3,1,1,NULL,NULL,NULL,1752490649775,1752490649775);
INSERT INTO StaticPage VALUES('cmd2zonn30007z1er6ufza9hg','for-schools',NULL,0,1,4,1,1,NULL,NULL,NULL,1752490649776,1752490649776);
INSERT INTO StaticPage VALUES('cmd2zonn40009z1er3u1guge9','faq',NULL,0,1,5,1,1,NULL,NULL,NULL,1752490649777,1752490649777);
INSERT INTO StaticPage VALUES('cmd2zonn5000bz1erep2q296c','contact',NULL,0,1,6,1,1,NULL,NULL,NULL,1752490649778,1752490649778);
INSERT INTO StaticPage VALUES('cmd2zonn6000dz1er6m3nlmyz','terms',NULL,0,1,10,0,1,NULL,NULL,NULL,1752490649779,1752490649779);
INSERT INTO StaticPage VALUES('cmd2zonn7000fz1ere6sa4k4j','privacy',NULL,0,1,11,0,1,NULL,NULL,NULL,1752490649780,1752490649780);
INSERT INTO StaticPage VALUES('cmd2zonn8000hz1ercbli90l9','cookies',NULL,0,1,12,0,1,NULL,NULL,NULL,1752490649781,1752490649781);
INSERT INTO StaticPage VALUES('cmd2zonn9000jz1erx6ree0od','help',NULL,0,1,20,1,1,NULL,NULL,NULL,1752490649781,1752490649781);
INSERT INTO StaticPage VALUES('cmd2zonna000lz1erznsjhuoc','blog',NULL,0,1,30,1,1,NULL,NULL,NULL,1752490649782,1752490649782);
INSERT INTO StaticPage VALUES('cmd2zonnb000oz1erf1jmfgfo','mission','cmd2zonmz0000z1erwwo7860o',1,1,1,1,1,NULL,NULL,NULL,1752490649784,1752490649784);
INSERT INTO StaticPage VALUES('cmd2zonnc000rz1er3k52o1tk','team','cmd2zonmz0000z1erwwo7860o',1,1,2,1,1,NULL,NULL,NULL,1752490649784,1752490649784);
INSERT INTO StaticPage VALUES('cmd2zonnd000uz1ern7anpdih','partners','cmd2zonmz0000z1erwwo7860o',1,1,3,1,1,NULL,NULL,NULL,1752490649785,1752490649785);
INSERT INTO StaticPage VALUES('cmd2zonnd000xz1era36ift03','getting-started','cmd2zonn9000jz1erx6ree0od',1,1,1,1,1,NULL,NULL,NULL,1752490649786,1752490649786);
INSERT INTO StaticPage VALUES('cmd2zonne0010z1erkgypjqse','account-settings','cmd2zonn9000jz1erx6ree0od',1,1,2,1,1,NULL,NULL,NULL,1752490649787,1752490649787);
INSERT INTO StaticPage VALUES('cmd2zonnf0013z1ertgi51fd7','troubleshooting','cmd2zonn9000jz1erx6ree0od',1,1,3,1,1,NULL,NULL,NULL,1752490649788,1752490649788);
INSERT INTO StaticPage VALUES('cmd2zonng0016z1eru3pdiz5d','safety-tips-beginners','cmd2zonna000lz1erznsjhuoc',1,1,1,1,1,NULL,NULL,NULL,1752490649789,1752490649789);
INSERT INTO StaticPage VALUES('cmd2zonnh0019z1er59vj4n0j','choosing-first-motorcycle','cmd2zonna000lz1erznsjhuoc',1,1,2,1,1,NULL,NULL,NULL,1752490649789,1752490649789);
INSERT INTO StaticPage VALUES('cmd2zonni001cz1erj7vp1977','platform-updates','cmd2zonna000lz1erznsjhuoc',1,1,3,1,1,NULL,NULL,NULL,1752490649790,1752490649790);
INSERT INTO StaticPage VALUES('cmd2zonni001fz1erqwyxnw1m','school-benefits','cmd2zonn30007z1er6ufza9hg',1,1,1,1,1,NULL,NULL,NULL,1752490649791,1752490649791);
INSERT INTO StaticPage VALUES('cmd2zonnj001iz1erg5drf8vk','school-pricing','cmd2zonn30007z1er6ufza9hg',1,1,2,1,1,NULL,NULL,NULL,1752490649792,1752490649792);
INSERT INTO StaticPage VALUES('cmd2zonnk001lz1ersl7d29ws','school-demo','cmd2zonn30007z1er6ufza9hg',1,1,3,1,1,NULL,NULL,NULL,1752490649793,1752490649793);
INSERT INTO StaticPage VALUES('cmd2zonnl001oz1erf8i4be6p','registration-guide','cmd2zonnd000xz1era36ift03',2,1,1,1,1,NULL,NULL,NULL,1752490649794,1752490649794);
INSERT INTO StaticPage VALUES('cmd2zonnm001rz1erl58rv1zw','first-lesson','cmd2zonnd000xz1era36ift03',2,1,2,1,1,NULL,NULL,NULL,1752490649794,1752490649794);
INSERT INTO StaticPage VALUES('cmd39w5ff0000z1shshuwa328','nebachiv',NULL,0,1,1,1,0,'Про проект Небачив - безпека мотоциклістів','Nebachiv - українська платформа для навчання безпечної їзди на мотоциклі. Наша місія - зменшити кількість аварій через освіту.',NULL,1752507795576,1752507795576);
CREATE TABLE IF NOT EXISTS "StaticPageTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StaticPageTranslation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "StaticPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO StaticPageTranslation VALUES('cmd2zonmz0001z1errp27hkej','cmd2zonmz0000z1erwwo7860o','UA','Про платформу',replace('# Про платформу Nebachiv\n\n## Освітня платформа, яка рятує життя\n\nNebachiv - це результат аналізу **8000+ відеозаписів ДТП** та **17 років досвіду** безпечної їзди в міському трафіку.\n\n### Наш підхід базується на фактах:\n\n- **600 відібраних кейсів** для детального аналізу\n- **300,000+ км** досвіду засновника в місті\n- **Реальні ДТП** як основа навчання\n- **Практичні навички** замість сухої теорії\n\n### Що ми пропонуємо:\n\n1. **Аналіз реальних аварій** - вчимося на чужих помилках\n2. **Практичні поради** - тільки те, що працює\n3. **Систематизовані знання** - від простого до складного\n\n### Чому це важливо:\n\nКожен рік в Україні гинуть сотні мотоциклістів. Більшість аварій можна було б уникнути при правильній підготовці.\n\n---\n\n*Проект створений після трагічної загибелі друга засновника - Андрія Вашека.*','\n',char(10)),'Дізнайтеся більше про нашу платформу',1752490649772,1752574245510);
INSERT INTO StaticPageTranslation VALUES('cmd2zonmz0002z1ergj520jg0','cmd2zonmz0000z1erwwo7860o','EN','About Platform',replace('# About Nebachiv\n\nEducational platform for motorcyclists...','\n',char(10)),'Learn more about our platform',1752490649772,1752490649772);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn20004z1erwq3t3si8','cmd2zonn20003z1ermsa0a6zx','UA','Як це працює',replace('# Як це працює\n\n## Простий шлях до безпечної їзди\n\n### 1. Реєстрація\nСтворіть акаунт безкоштовно. Базові матеріали доступні всім.\n\n### 2. Оцінка рівня\nПройдіть тест для визначення вашого досвіду та потреб.\n\n### 3. Навчання\nОтримайте доступ до:\n- **600 проаналізованих кейсів** ДТП\n- **Практичних порад** з 17-річного досвіду\n- **Структурованих уроків** від базових до експертних\n\n### 4. Практика\nЗастосовуйте знання на дорозі під наглядом досвідчених райдерів.\n\n### 5. Спільнота\nДіліться досвідом та вчіться у інших.\n\n---\n\n*Все починається з усвідомлення: безпека - це навичка, якій можна навчитись.*','\n',char(10)),'Покроковий гід по використанню платформи',1752490649774,1752574245515);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn20006z1erdey6oulq','cmd2zonn20005z1erobhzesm9','UA','Тарифи',replace('# Тарифи\n\n## Наша філософія\n\nБазові знання з безпеки мають бути доступні кожному. Детальна інформація про тарифи та ціни буде опублікована найближчим часом.\n\n### Планується:\n\n- **Безкоштовний доступ** до базових матеріалів з безпеки\n- **Розширені курси** для поглибленого навчання\n- **Спеціальні умови** для мотошкіл\n\n### Тимчасово:\n\nПоки платформа знаходиться в розробці, весь контент доступний безкоштовно.\n\nСлідкуйте за оновленнями!\n\n📧 Питання: info@nebachiv.com','\n',char(10)),'Оберіть підходящий тарифний план',1752490649775,1752573678420);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn30008z1er4x40qcy0','cmd2zonn30007z1er6ufza9hg','UA','Для мотошкіл',replace('# Для мотошкіл\n\n## Покращте якість навчання реальними кейсами\n\nНаша база знань допоможе вашим інструкторам:\n\n### Що ви отримаєте:\n\n- **600 відібраних ДТП** для розбору з учнями\n- **Структуровані уроки** на основі 17-річного досвіду\n- **Методичні матеріали** для інструкторів\n\n### Переваги для вашої школи:\n\n1. **Підвищення якості навчання** - реальні кейси замість теорії\n2. **Безпека учнів** - навчання на чужих помилках\n3. **Репутація** - випускники готові до реальних ситуацій\n\n### Контакти:\n\n📧 schools@nebachiv.com\n\n---\n\n*Інвестуйте в якість навчання - рятуйте життя своїх учнів.*','\n',char(10)),'Спеціальні рішення для мотошкіл',1752490649776,1752574245516);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn4000az1er8tbs9qcm','cmd2zonn40009z1er3u1guge9','UA','Часті питання',replace('# Часті питання\n\n## Про проект Nebachiv\n\n### Хто створив проект?\nПроект створив Чингис - мотоцикліст з 17-річним досвідом, який проаналізував понад 8000 відеозаписів ДТП після того, як його друг Андрій Вашеко загинув у типовій аварії.\n\n### Яка мета проекту?\nЗменшити кількість мотоциклетних аварій в Україні через освіту та практичне навчання безпечній їзді.\n\n### Що означає назва "Небачив"?\nНазва походить від найпоширенішої фрази водіїв після ДТП з мотоциклістом: "Я його не бачив". Ми працюємо над тим, щоб ця фраза зникла з доріг.\n\n## Про навчання\n\n### Які матеріали доступні?\n- Аналіз реальних ДТП (600 відібраних кейсів)\n- Практичні поради з безпеки\n- Технічні аспекти керування мотоциклом\n\n### Чи є сертифікація?\nІнформація про сертифікацію буде додана після запуску повної версії платформи.\n\n## Технічні питання\n\n### Які пристрої підтримуються?\nПлатформа працює на всіх сучасних браузерах та мобільних пристроях.\n\n### Чи можна дивитися офлайн?\nФункція офлайн-перегляду планується в майбутніх оновленнях.\n\n## Контакти\n\n📧 Email: info@nebachiv.com\n\n*FAQ оновлюється в міру розвитку проекту.*','\n',char(10)),'Відповіді на популярні питання',1752490649777,1752573678421);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn5000cz1erlivkgdlr','cmd2zonn5000bz1erep2q296c','UA','Контакти',replace('# Контакти\n\n## Зв''яжіться з нами\n\n### Основні контакти:\n\n📧 **Email**: info@nebachiv.com\n\n### Спеціалізовані контакти:\n\n- **Для мотошкіл**: schools@nebachiv.com\n- **Партнерство**: partners@nebachiv.com\n- **Технічна підтримка**: support@nebachiv.com\n\n### Соціальні мережі:\n\n- **Telegram**: @nebachiv_safety\n- **Instagram**: @nebachiv.ua (планується)\n\n### Години роботи:\n\nПн-Пт: 9:00 - 18:00\nВідповідь email: протягом 24 годин\n\n---\n\n*Ми завжди раді почути ваші питання та пропозиції.*','\n',char(10)),'Зв''яжіться з нами',1752490649778,1752574245519);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn6000ez1erp5ktcrug','cmd2zonn6000dz1er6m3nlmyz','UA','Умови використання',replace('# Умови використання\n\n## Останнє оновлення: Січень 2025\n\n### 1. Прийняття умов\n\nВикористовуючи платформу Nebachiv, ви погоджуєтесь з цими умовами.\n\n### 2. Використання контенту\n\n- Контент призначений виключно для навчальних цілей\n- Базується на аналізі 8000+ реальних ДТП\n- Не замінює офіційне навчання в мотошколі\n\n### 3. Відповідальність\n\n- Ми надаємо інформацію на основі досвіду та аналізу\n- Остаточна відповідальність за безпеку - на водієві\n- Рекомендуємо практику під наглядом інструктора\n\n### 4. Конфіденційність\n\nВаші дані захищені згідно з нашою політикою конфіденційності.\n\n### 5. Зміни умов\n\nМи можемо оновлювати умови. Продовження використання означає згоду.\n\n---\n\n*Питання: legal@nebachiv.com*','\n',char(10)),'Умови використання платформи',1752490649779,1752574245520);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn7000gz1erbeelhvet','cmd2zonn7000fz1ere6sa4k4j','UA','Політика конфіденційності',replace('# Політика конфіденційності\n\n## Ваша приватність важлива для нас\n\n### Які дані ми збираємо:\n\n1. **Реєстраційні дані**: email, ім''я\n2. **Навчальний прогрес**: пройдені уроки, результати тестів\n3. **Технічні дані**: для покращення платформи\n\n### Як ми використовуємо дані:\n\n- Для надання доступу до навчальних матеріалів\n- Для відстеження вашого прогресу\n- Для покращення платформи\n\n### Ми НЕ:\n\n- Продаємо ваші дані третім сторонам\n- Використовуємо дані для реклами\n- Передаємо дані без вашої згоди\n\n### Ваші права:\n\n- Доступ до своїх даних\n- Видалення акаунту\n- Експорт даних\n\n---\n\n*Питання: privacy@nebachiv.com*','\n',char(10)),'Як ми обробляємо ваші дані',1752490649780,1752574245520);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn8000iz1er14nzcor8','cmd2zonn8000hz1ercbli90l9','UA','Політика Cookie',replace('# Політика Cookie\n\n## Як ми використовуємо cookie\n\n### Необхідні cookie:\n\n- **Авторизація**: щоб ви залишались в системі\n- **Налаштування**: ваші преференції\n- **Безпека**: захист від атак\n\n### Аналітичні cookie:\n\n- Як ви використовуєте платформу\n- Які уроки найпопулярніші\n- Де виникають проблеми\n\n### Ми НЕ використовуємо:\n\n- Рекламні cookie\n- Трекінгові cookie третіх сторін\n- Персоналізовані рекламні профілі\n\n### Управління cookie:\n\nВи можете вимкнути cookie в налаштуваннях браузера, але це може вплинути на функціональність.\n\n---\n\n*Питання: privacy@nebachiv.com*','\n',char(10)),'Інформація про використання cookie',1752490649781,1752574245521);
INSERT INTO StaticPageTranslation VALUES('cmd2zonn9000kz1eret8cd6k3','cmd2zonn9000jz1erx6ree0od','UA','Довідка',replace('# Довідка\n\n## Як користуватися платформою Nebachiv\n\n### Початок роботи:\n\n1. **Зареєструйтесь** - це безкоштовно\n2. **Пройдіть тест** - визначте свій рівень\n3. **Почніть навчання** - з рекомендованих уроків\n\n### Основні розділи:\n\n- **Аналіз ДТП** - 600 відібраних кейсів\n- **Уроки безпеки** - структурований курс\n- **Практичні поради** - з 17-річного досвіду\n\n### Часті питання:\n\n**Чи потрібен досвід?**\nНі, ми навчаємо з нуля.\n\n**Скільки часу займає навчання?**\nЗалежить від вас. Рекомендуємо 1-2 уроки на день.\n\n**Чи видаєте сертифікат?**\nПланується після запуску повної версії.\n\n---\n\n*Не знайшли відповідь? support@nebachiv.com*','\n',char(10)),'Центр допомоги користувачів',1752490649781,1752574245522);
INSERT INTO StaticPageTranslation VALUES('cmd2zonna000mz1ert9u2dwpi','cmd2zonna000lz1erznsjhuoc','UA','Блог',replace('# Блог Nebachiv\n\n## Аналіз ДТП та безпека на дорозі\n\nНаш блог присвячений реальному аналізу дорожніх ситуацій та практичним порадам з безпеки.\n\n### Основа нашого контенту:\n\n- **8000+** проаналізованих відеозаписів ДТП\n- **600** відібраних навчальних кейсів\n- **17 років** практичного досвіду засновника\n- **300,000+ км** в міському трафіку\n\n### Теми, які ми висвітлюємо:\n\n1. **Аналіз реальних ДТП**\n   - Детальний розбір причин\n   - Як можна було уникнути\n   - Практичні висновки\n\n2. **Техніка безпечної їзди**\n   - Досвід з шосейно-кільцевих перегонів\n   - Навички зі стантрайдингу для безпеки\n   - Контроль мотоцикла в критичних ситуаціях\n\n3. **Психологія на дорозі**\n   - Чому водії не бачать мотоциклістів\n   - Як правильно прогнозувати дії інших учасників руху\n   - Ментальна підготовка до їзди\n\n### Найближчим часом:\n\nМи готуємо серію детальних статей на основі нашої бази знань. Слідкуйте за оновленнями!\n\n---\n\n*Блог поповнюється новими матеріалами щотижня.*','\n',char(10)),'Новини платформи та корисні матеріали',1752490649782,1752573678422);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnb000pz1erhphf9eip','cmd2zonnb000oz1erf1jmfgfo','UA','Наша місія',replace('# Наша місія\n\n## Зменшити кількість загиблих мотоциклістів в Україні\n\nПісля втрати друга в типовій аварії ("водій не побачив"), засновник проекту Чингис вирішив змінити ситуацію через освіту.\n\n### Наші цілі:\n\n1. **Навчити бачити небезпеку** - на основі аналізу 8000+ ДТП\n2. **Дати практичні навички** - з досвіду 300,000+ км їзди\n3. **Створити спільноту** - де досвід передається новачкам\n\n### Як ми це робимо:\n\n- Аналізуємо реальні аварії\n- Виділяємо типові помилки\n- Навчаємо їх уникати\n\n---\n\n*"Кожен врятований мотоцикліст - це чиясь родина, яка залишилася цілою"*','\n',char(10)),'Місія та цінності Nebachiv',1752490649784,1752574245513);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnc000sz1er5z32ibl0','cmd2zonnc000rz1er3k52o1tk','UA','Наша команда',replace('# Наша команда\n\n## Засновник проекту\n\n### Чингис (Chyngys)\n**Засновник та головний ідеолог проекту Nebachiv**\n\n#### Реальні факти:\n- **17 років** досвіду їзди на мотоциклі\n- **300,000+ км** пройдено в міському трафіку\n- **8,000+** відеозаписів ДТП проаналізовано\n- **600** найбільш показових аварій відібрано для навчання\n\n#### Історія створення проекту:\n> "Проект Nebachiv народився після трагедії - мій друг Андрій Вашеко загинув у типовій мотоциклетній аварії. Водій сказав стандартну фразу: ''Я його не бачив''. Тоді я вирішив, що треба не оплакувати жертви, а запобігати новим трагедіям через освіту."\n\n#### Досвід:\n- Шосейно-кільцеві перегони\n- Стантрайдинг\n- Мотоциклетний дріфт\n- Джимхана\n\n---\n\n## Команда проекту\n\nНа даний момент детальна інформація про інших членів команди готується до публікації. \n\nПроект активно розвивається, і ми шукаємо:\n- Досвідчених інструкторів\n- Технічних спеціалістів\n- Модераторів спільноти\n\n### Контакти для співпраці:\n📧 info@nebachiv.com\n\n---\n\n*Інформація буде доповнюватися реальними даними про команду.*','\n',char(10)),'Познайомтесь з нашою командою',1752490649784,1752573678416);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnd000vz1erndtbcpok','cmd2zonnd000uz1ern7anpdih','UA','Партнери',replace('# Партнери\n\n## Співпраця для безпеки\n\nМи відкриті до співпраці з:\n\n- **Мотошколами** - для покращення якості навчання\n- **Мотоклубами** - для поширення культури безпеки\n- **Виробниками екіпіровки** - для промоції якісного захисту\n\n### Що ми пропонуємо партнерам:\n\n- Доступ до бази знань (600 відібраних кейсів)\n- Методичні матеріали на основі реальних ДТП\n- Підтримку в навчанні інструкторів\n\n### Контакти для партнерства:\n\n📧 partners@nebachiv.com\n\n---\n\n*Разом ми можемо зробити більше для безпеки на дорогах.*','\n',char(10)),'Наші партнери та співпраця',1752490649785,1752574245514);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnd000yz1ertbhyqvyx','cmd2zonnd000xz1era36ift03','UA','Початок роботи',replace('# Початок роботи з Nebachiv\n\n## Ваш шлях до безпечної їзди починається тут\n\n### Крок 1: Реєстрація\n- Введіть email та створіть пароль\n- Підтвердіть email\n- Заповніть базову інформацію про досвід\n\n### Крок 2: Оцінка рівня\n- Чесно відповідайте на питання\n- Це допоможе підібрати правильні матеріали\n- Можна пройти повторно пізніше\n\n### Крок 3: Перший урок\n- Почніть з аналізу базових помилок\n- Подивіться 2-3 відео з реальними ДТП\n- Зробіть нотатки\n\n### Крок 4: Практика\n- Застосуйте знання на закритій території\n- Попросіть досвідченого райдера оцінити\n- Не поспішайте на дорогу\n\n---\n\n*Пам''ятайте: навчання на чужих помилках - це безпечно та ефективно.*','\n',char(10)),'Швидкий старт для нових користувачів',1752490649786,1752574245523);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnf0011z1erdfbyltqi','cmd2zonne0010z1erkgypjqse','UA','Налаштування акаунту',replace('# Налаштування акаунту\n\n## Керуйте своїм профілем\n\n### Основні налаштування:\n\n**Зміна пароля:**\n1. Перейдіть в профіль\n2. Натисніть "Змінити пароль"\n3. Введіть старий та новий пароль\n\n**Зміна email:**\n1. Новий email потребує підтвердження\n2. Старий email отримає повідомлення\n3. Підтвердіть зміну протягом 24 годин\n\n### Налаштування сповіщень:\n\n- Новини платформи\n- Нагадування про навчання\n- Оновлення контенту\n\n### Видалення акаунту:\n\nВи можете видалити акаунт в будь-який час. Ваші дані будуть повністю видалені.\n\n---\n\n*Потрібна допомога? support@nebachiv.com*','\n',char(10)),'Управління вашим акаунтом',1752490649787,1752574245523);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnf0014z1erm91deu6d','cmd2zonnf0013z1ertgi51fd7','UA','Вирішення проблем',replace('# Вирішення проблем\n\n## Технічна підтримка\n\n### Проблеми з доступом до платформи\n\nЯкщо у вас виникли проблеми з доступом до матеріалів:\n\n1. Перевірте інтернет-з''єднання\n2. Спробуйте оновити сторінку (F5)\n3. Очистіть кеш браузера\n4. Спробуйте інший браузер\n\n### Проблеми з відтворенням відео\n\nДля коректного відтворення навчальних відео:\n- Рекомендований браузер: Chrome, Firefox, Safari\n- Мінімальна швидкість інтернету: 5 Мбіт/с\n- Вимкніть блокувальники реклами\n\n### Інші питання\n\nЯкщо проблема не вирішується:\n\n📧 Напишіть нам: info@nebachiv.com\n\nОпишіть проблему детально, вкажіть:\n- Який пристрій використовуєте\n- Який браузер\n- Скріншот помилки (якщо є)\n\n---\n\n*Ми відповідаємо протягом 24 годин.*','\n',char(10)),'Вирішення технічних проблем',1752490649788,1752573678424);
INSERT INTO StaticPageTranslation VALUES('cmd2zonng0017z1ery0da19xr','cmd2zonng0016z1eru3pdiz5d','UA','Поради з безпеки для початківців',replace('# Поради з безпеки для початківців\n\n## Основи, які врятують життя\n\nЗ аналізу 8000+ ДТП ми виділили ключові поради:\n\n### 1. Вас не бачать - це факт\n- 90% водіїв кажуть "я його не бачив"\n- Їдьте так, ніби ви невидимі\n- Завжди майте план відступу\n\n### 2. Перший сезон = навчання\n- Забудьте про швидкість\n- Фокус на техніці гальмування\n- Практикуйте на закритій території\n\n### 3. Екіпіровка - не для краси\n- Шолом рятує в 37% смертельних ДТП\n- Захист спини критично важливий\n- Взуття має закривати кісточки\n\n### 4. Погода = небезпека\n- Дощ збільшує гальмівний шлях вдвічі\n- Перший дощ найнебезпечніший\n- Вітер може знести з смуги\n\n---\n\n*Детальний розбір кожної поради - в наших уроках.*','\n',char(10)),'Важливі поради для мотоциклістів-початківців',1752490649789,1752574245524);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnh001az1ereya50ov3','cmd2zonnh0019z1er59vj4n0j','UA','Як обрати перший мотоцикл',replace('# Як обрати перший мотоцикл\n\n## Поради з 17-річного досвіду\n\n### Головні критерії:\n\n**1. Потужність**\n- Не більше 50-70 к.с. для початку\n- 400-650 куб.см оптимально\n- Плавна подача потужності\n\n**2. Вага**\n- До 200 кг в заправленому стані\n- Ви повинні легко тримати його\n- Можливість підняти з землі\n\n**3. Безпека**\n- ABS обов''язково (рятує життя)\n- Хороші гальма\n- Якісна гума\n\n**4. Практичність**\n- Доступність запчастин\n- Простота обслуговування\n- Наявність захисних дуг\n\n### Що НЕ брати новачку:\n- Спортбайки (занадто різкі)\n- Важкі турери (складно маневрувати)\n- Старі мотоцикли без ABS\n\n---\n\n*Засновник проекту почав з 400сс і не шкодує.*','\n',char(10)),'Гід по вибору мотоцикла для початківців',1752490649789,1752574245525);
INSERT INTO StaticPageTranslation VALUES('cmd2zonni001dz1erw3sigiu8','cmd2zonni001cz1erj7vp1977','UA','Оновлення платформи',replace('# Оновлення платформи Nebachiv\n\n## Що нового\n\n### Січень 2025:\n- Запуск базової версії платформи\n- 600 проаналізованих кейсів ДТП\n- Структуровані уроки для початківців\n\n### В розробці:\n- Мобільний додаток\n- Офлайн доступ до матеріалів\n- Розширена аналітика прогресу\n- Інтеграція з мотошколами\n\n### Плани на майбутнє:\n- Додати ще 1000+ кейсів\n- VR симулятор небезпечних ситуацій\n- Персональні консультації\n\n---\n\n*Слідкуйте за оновленнями: @nebachiv_news*','\n',char(10)),'Новини та оновлення Nebachiv',1752490649790,1752574245526);
INSERT INTO StaticPageTranslation VALUES('cmd2zonni001gz1erh22whsem','cmd2zonni001fz1erqwyxnw1m','UA','Переваги для шкіл',replace('# Переваги для мотошкіл\n\n## Чому варто співпрацювати з Nebachiv\n\n### 1. Унікальна база знань\n- **8000+ проаналізованих ДТП**\n- **600 навчальних кейсів**\n- **Постійне оновлення** матеріалів\n\n### 2. Досвід засновника\n- **17 років** безаварійної їзди\n- **300,000+ км** в міському трафіку\n- **Реальна експертиза** в безпеці\n\n### 3. Практичний підхід\n- Тільки те, що працює на дорозі\n- Без зайвої теорії\n- Фокус на виживання\n\n### 4. Підтримка інструкторів\n- Методичні матеріали\n- Регулярні оновлення\n- Обмін досвідом\n\n---\n\n*Дайте своїм учням більше, ніж просто навички керування.*','\n',char(10)),'Переваги використання платформи для мотошкіл',1752490649791,1752574245517);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnj001jz1eri2rwjm7v','cmd2zonnj001iz1erg5drf8vk','UA','Тарифи для шкіл',replace('# Тарифи для мотошкіл\n\n## Інвестиція в безпеку ваших учнів\n\nДетальна інформація про тарифи для навчальних закладів буде опублікована після офіційного запуску платформи.\n\n### Що буде включено:\n\n- Доступ до всієї бази знань (600+ кейсів)\n- Методичні матеріали для інструкторів\n- Підтримка та консультації\n- Регулярні оновлення\n\n### Для отримання інформації:\n\n📧 pricing@nebachiv.com\n\n---\n\n*Ціна навчання завжди менша за ціну помилки на дорозі.*','\n',char(10)),'Тарифні плани для мотошкіл',1752490649792,1752574245518);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnk001mz1erhc9f1a81','cmd2zonnk001lz1ersl7d29ws','UA','Замовити демо',replace('# Замовити демонстрацію\n\n## Побачте Nebachiv в дії\n\nМи покажемо вам:\n\n- **Реальні кейси** з нашої бази (600+ ДТП)\n- **Методику навчання** на прикладах\n- **Можливості платформи** для вашої школи\n\n### Що ви дізнаєтесь:\n\n1. Як використовувати реальні ДТП в навчанні\n2. Як підвищити безпеку випускників\n3. Як покращити репутацію школи\n\n### Замовити демо:\n\n📧 demo@nebachiv.com\n📱 Telegram: @nebachiv_demo\n\n---\n\n*Демонстрація безкоштовна та без зобов''язань.*','\n',char(10)),'Замовити демонстрацію для вашої школи',1752490649793,1752574245518);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnl001pz1eryjzpeeu4','cmd2zonnl001oz1erf8i4be6p','UA','Гід з реєстрації',replace('# Гід з реєстрації\n\n## Приєднуйтесь до спільноти безпечних райдерів\n\n### Що вам знадобиться:\n- Діючий email\n- 5 хвилин часу\n- Бажання вчитися\n\n### Покрокова інструкція:\n\n**1. Перейдіть на сторінку реєстрації**\nНатисніть "Реєстрація" вгорі сайту\n\n**2. Введіть дані**\n- Email (для входу та сповіщень)\n- Пароль (мінімум 8 символів)\n- Ім''я (як до вас звертатися)\n\n**3. Підтвердіть email**\nПеревірте пошту та натисніть посилання\n\n**4. Розкажіть про свій досвід**\nЦе допоможе підібрати правильні матеріали\n\n**5. Готово!**\nВи маєте доступ до бази знань з 600+ кейсів\n\n---\n\n*Проблеми з реєстрацією? support@nebachiv.com*','\n',char(10)),'Детальний гід по реєстрації',1752490649794,1752574245524);
INSERT INTO StaticPageTranslation VALUES('cmd2zonnm001sz1ergko7kums','cmd2zonnm001rz1erl58rv1zw','UA','Перший урок',replace('# Перший урок\n\n## Початок безпечної їзди\n\nПерший урок - це фундамент вашої безпеки на дорозі. \n\n### Що ви дізнаєтесь:\n\n1. **Основи безпеки**\n   - Чому 90% аварій трапляються через "не побачив"\n   - Як стати помітним на дорозі\n   - Базові правила виживання в трафіку\n\n2. **Практичні навички**\n   - Правильна посадка та положення тіла\n   - Основи керування мотоциклом\n   - Техніка безпечного гальмування\n\n3. **Аналіз помилок**\n   - Розбір типових помилок новачків\n   - Реальні приклади з 600 відібраних ДТП\n   - Як вчитися на чужих помилках\n\n### Важливо знати:\n\nНаш підхід базується на аналізі 8000+ реальних аварій. Ми не вчимо теорії заради теорії - кожна порада перевірена практикою та може врятувати життя.\n\n### Підготовка до уроку:\n\n1. Переконайтесь, що маєте базову екіпіровку\n2. Будьте готові до серйозного ставлення до безпеки\n3. Залиште амбіції - навчання важливіше за швидкість\n\n---\n\n*Детальний план уроку буде доступний після реєстрації.*','\n',char(10)),'Гід по проходженню першого уроку',1752490649794,1752573678423);
INSERT INTO StaticPageTranslation VALUES('cmd39w5fg0001z1sh2g3i50le','cmd39w5ff0000z1shshuwa328','UA','Про проект Небачив',replace('# Про проект Небачив\n\n## Наша місія\n\n**Небачив** - це більше ніж просто навчальна платформа. Це рух за безпеку українських мотоциклістів, народжений з болю втрат та бажання змінити статистику аварій.\n\n## Чому "Небачив"?\n\nНазва проекту походить від найпоширенішої фрази водіїв після ДТП з мотоциклістом: "Я його не бачив". Ми працюємо над тим, щоб ця фраза назавжди зникла з українських доріг.\n\n## Що ми робимо\n\n### 📚 Освітня платформа\n- Безкоштовні матеріали з безпеки водіння\n- Структуровані курси для різних рівнів\n- Тести для перевірки знань\n- Відео-уроки від досвідчених інструкторів\n\n### 🎯 Аналіз ДТП\n- База даних реальних аварій\n- Розбір типових помилок\n- Рекомендації щодо уникнення небезпек\n- Статистика та тренди\n\n### 🤝 Спільнота\n- Форум для обміну досвідом\n- Локальні зустрічі та тренінги\n- Підтримка новачків\n- Менторська програма\n\n## Наші принципи\n\n1. **Безпека понад усе** - жодних компромісів у питаннях безпеки\n2. **Доступність** - базові матеріали безкоштовні для всіх\n3. **Практичність** - тільки перевірений досвід, без води\n4. **Спільнота** - разом ми сильніші\n\n## Статистика проекту\n\n- **1000+** мотоциклістів пройшли навчання\n- **50+** розібраних кейсів ДТП\n- **100+** годин навчальних матеріалів\n- **8** принципів безпечної їзди\n\n## Команда\n\nПроект створений мотоциклістами для мотоциклістів. Ми не просто теоретики - кожен член команди має досвід їзди та розуміє реальні виклики на дорозі.\n\n## Підтримати проект\n\nЯкщо ви хочете допомогти розвитку проекту:\n- Поділіться знаннями з іншими\n- Долучайтеся до створення контенту\n- Підтримайте фінансово\n- Розкажіть про нас друзям\n\n## Контакти\n\n- Email: info@nebachiv.com\n- Telegram: @nebachiv_safety\n- Instagram: @nebachiv.ua\n\n---\n\n*"Кожен врятований мотоцикліст - це чиясь родина, яка залишилася цілою"*','\n',char(10)),'Платформа для безпеки мотоциклістів України',1752507795576,1752507795576);
CREATE TABLE IF NOT EXISTS "StaticPageTag" (
    "pageId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("pageId", "tagId"),
    CONSTRAINT "StaticPageTag_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "StaticPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StaticPageTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "StaticPageComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StaticPageComment_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "StaticPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StaticPageComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StaticPageComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "StaticPageComment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "_ContentRelations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ContentRelations_A_fkey" FOREIGN KEY ("A") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ContentRelations_B_fkey" FOREIGN KEY ("B") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "_AnswerToUserAnswer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AnswerToUserAnswer_A_fkey" FOREIGN KEY ("A") REFERENCES "Answer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AnswerToUserAnswer_B_fkey" FOREIGN KEY ("B") REFERENCES "UserAnswer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "EmailCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "recipientSource" TEXT NOT NULL,
    "recipientCount" INTEGER NOT NULL,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "sentBy" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "compareAt" REAL,
    "currency" TEXT NOT NULL DEFAULT 'UAH',
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "story" TEXT,
    "features" TEXT,
    "materials" TEXT,
    "trackInventory" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "impactMessage" TEXT,
    "impactCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Product VALUES('cmd4p5re80000z1k88a83hxv1','Test "Я бачу" T-Shirt','test-ya-bachu-tshirt','Premium t-shirt for conscious riders','t-shirt',599.0,799.0,'UAH',NULL,NULL,'This shirt reminds you to always stay alert on the road.','["Premium organic cotton","Reflective elements","Comfortable fit","Supports safety education"]',NULL,1,'active',1,'Supports 2 students'' safety education',2,1752593904369,1752593904369);
CREATE TABLE IF NOT EXISTS "ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" REAL,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO ProductVariant VALUES('cmd4p5reg0002z1k8kir0gthr','cmd4p5re80000z1k88a83hxv1','M','black','YB-TSHIRT-M-BLACK',NULL,50,0,1752593904376,1752593904376);
INSERT INTO ProductVariant VALUES('cmd4p5reg0006z1k8nxxprk2o','cmd4p5re80000z1k88a83hxv1','M','white','YB-TSHIRT-M-WHITE',NULL,25,0,1752593904376,1752593904376);
INSERT INTO ProductVariant VALUES('cmd4p5reg0005z1k8ecg2jbiu','cmd4p5re80000z1k88a83hxv1','L','black','YB-TSHIRT-L-BLACK',NULL,30,0,1752593904376,1752593904376);
CREATE TABLE IF NOT EXISTS "ProductImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO ProductImage VALUES('cmd4p5reu0009z1k82crg7eoy','cmd4p5re80000z1k88a83hxv1','/shop/images/ya-bachu-tshirt-white.jpg','Я бачу T-Shirt in White',1,1752593904391);
INSERT INTO ProductImage VALUES('cmd4p5reu000az1k8gibsc9gp','cmd4p5re80000z1k88a83hxv1','/shop/images/ya-bachu-tshirt-black.jpg','Я бачу T-Shirt in Black',0,1752593904391);
CREATE TABLE IF NOT EXISTS "CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO CartItem VALUES('cmd4p5rf2000ez1k8bl6il0zd','cmd4p5rf1000cz1k8klnyi0z8','cmd4p5re80000z1k88a83hxv1','cmd4p5reg0002z1k8kir0gthr',2,1752593904399,1752593904399);
INSERT INTO CartItem VALUES('cmd4q61ss0002z14spyjpkqp0','cmd4q61sq0000z14s9aqn3yvp','cmd4p5re80000z1k88a83hxv1','cmd4p5reg0005z1k8ecg2jbiu',3,1752595597468,1752595597533);
INSERT INTO CartItem VALUES('cmd50kqia0002z1kyrlsggbxr','cmd50kqi90000z1ky4ac1ebjb','cmd4p5re80000z1k88a83hxv1','cmd4p5reg0005z1k8ecg2jbiu',3,1752613078835,1752613134444);
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "shippingName" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingZip" TEXT,
    "shippingMethod" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "shippingCost" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "trackingNumber" TEXT,
    "trackingUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "shippedAt" DATETIME,
    "deliveredAt" DATETIME,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "Order" VALUES('cmd4p5rf3000gz1k8aehekbp7','NEB-1752593904399','cmd2zn0my0006z16zn11k0cu0','student@test.com','+380501234567','Test User','Київ, вул. Тестова 1','Київ',NULL,'nova_poshta',1198.0,0.0,0.0,1198.0,'stripe','pending',NULL,'pending',NULL,NULL,1752593904400,1752593904400,NULL,NULL);
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "title" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO OrderItem VALUES('cmd4p5rf5000iz1k8dvnwuxds','cmd4p5rf3000gz1k8aehekbp7','cmd4p5re80000z1k88a83hxv1','cmd4p5reg0002z1k8kir0gthr',2,599.0,'Test "Я бачу" T-Shirt','M','black',1752593904401);
CREATE TABLE IF NOT EXISTS "ProductReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Discount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "minAmount" REAL,
    "maxAmount" REAL,
    "userEmail" TEXT,
    "userRole" TEXT,
    "validFrom" DATETIME NOT NULL,
    "validUntil" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Discount VALUES('cmd4p5rf6000jz1k8bnebj5yw','STUDENT15','percentage',15.0,100,0,500.0,NULL,NULL,'STUDENT',1752593904402,1755185904402,1,1752593904402,1752593904402);
CREATE TABLE IF NOT EXISTS "Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "sessionId" TEXT,
    "guestEmail" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Cart VALUES('cmd4p5rf1000cz1k8klnyi0z8','cmd2zn0my0006z16zn11k0cu0',NULL,NULL,0,1752593904398,1752593904398,1755185904396);
INSERT INTO Cart VALUES('cmd4q61sq0000z14s9aqn3yvp',NULL,'test-session-1752595597224',NULL,0,1752595597467,1752595597533,1755187597466);
INSERT INTO Cart VALUES('cmd50kqi90000z1ky4ac1ebjb',NULL,'session-1752613078640-tkmrutdyh',NULL,0,1752613078833,1752613134445,1755205078833);
CREATE TABLE IF NOT EXISTS "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Setting VALUES('cmdlmqalq0000z11kdtp2nfm1','site_config','{"general":{"siteName":"Nebachiv Content App","siteDescription":"Освітня платформа для мотоциклістів","contactEmail":"info@nebachiv.com","supportEmail":"support@nebachiv.com","timezone":"Europe/Kiev","language":"uk","dateFormat":"DD.MM.YYYY"},"security":{"requireEmailVerification":true,"allowSocialLogin":true,"sessionTimeout":1440,"maxLoginAttempts":5,"passwordMinLength":8,"require2FA":false},"notifications":{"emailNotifications":true,"newUserNotification":true,"paymentNotification":true,"lowStockNotification":true,"systemUpdates":false},"payments":{"currency":"UAH","stripeEnabled":true,"stripePublicKey":"","liqpayEnabled":false,"liqpayPublicKey":"","taxRate":20},"content":{"defaultLanguage":"uk","enableComments":true,"moderateComments":true,"enableRatings":true,"contentCacheTime":3600},"api":{"kbNebApiUrl":"http://localhost:8000/api/v1","kbNebApiKey":"kb_neb_prod_nebachiv_xxx","enableWebhooks":false,"webhookSecret":"","rateLimitPerMinute":60}}',1753617748526,1753617969664);
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UAH',
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "orderId" TEXT,
    "provider" TEXT NOT NULL,
    "providerPaymentId" TEXT,
    "metadata" JSONB,
    "completedAt" DATETIME,
    "failedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "password" TEXT,
    "name" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "phone" TEXT,
    "dateOfBirth" DATETIME,
    "schoolId" TEXT,
    "schoolGroupId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionStatus" TEXT,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE',
    "subscriptionCurrentPeriodEnd" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME,
    "defaultShippingAddress" TEXT,
    "preferredShippingMethod" TEXT,
    "wishlist" TEXT,
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "loyaltyTier" TEXT NOT NULL DEFAULT 'bronze',
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "deletionReason" TEXT,
    CONSTRAINT "User_schoolGroupId_fkey" FOREIGN KEY ("schoolGroupId") REFERENCES "SchoolGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO User VALUES('cmd2zn03b0000z16zz3riko5y','admin@nebachiv.com',1752490572597,'$2a$10$Pamk/EdM3CYjNMfFiJjK7.HnsAcyVnhyoriFOzjdpF8YaKP2Sbt6i','Admin User',NULL,'ADMIN',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FREE',NULL,1752490572599,1754509523912,1754509523911,NULL,NULL,NULL,0,'bronze',NULL,NULL,NULL);
INSERT INTO User VALUES('cmd2zn09u0003z16zkjf5d74c','school@nebachiv.com',1752490572834,'$2a$10$fn7nXU5G0De5PDQPEFZ7G.PgtfXahlsZXB6k58L/ceEUKkgr0DrAW','School Admin',NULL,'SCHOOL_ADMIN',NULL,NULL,'cmd2zn03d0001z16zu03uq0uq',NULL,NULL,NULL,NULL,'FREE',NULL,1752490572835,1753545996589,1753545996588,NULL,NULL,NULL,0,'bronze',NULL,NULL,NULL);
INSERT INTO User VALUES('cmd2zn0gg0005z16z4m78um6c','student@nebachiv.com',1752490573071,'$2a$10$yCvXU6SWuYwBzWklzB..UeLXFC9ZxOfBTlcOa8JDyQEhV.JUepYSK','Demo Student',NULL,'STUDENT',NULL,NULL,'cmd2zn03d0001z16zu03uq0uq',NULL,NULL,NULL,NULL,'FREE',NULL,1752490573072,1753546532299,1753546532298,NULL,NULL,NULL,0,'bronze',NULL,NULL,NULL);
INSERT INTO User VALUES('cmd2zn0my0006z16zn11k0cu0','student@test.com',1752490573306,'$2a$10$v540MeewbWvwsmeU8xpqtOvvHceUD6FwZM06oa/i9J/9IgwHYPbGm','Test Student',NULL,'STUDENT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FREE',NULL,1752490573307,1753906387935,1753572125534,'Київ, вул. Тестова 1','nova_poshta','["cmd4p5re80000z1k88a83hxv1"]',100,'bronze',NULL,NULL,NULL);
INSERT INTO User VALUES('cmd2zn0te0007z16zk0o44bng','admin@test.com',1752490573538,'$2a$10$zTekKU7ApYqscYqPNO6.LeuHaJmmMVkaltKElxMzW4X9jZ0fAJnHy','System Admin',NULL,'ADMIN',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FREE',NULL,1752490573538,1753906388105,NULL,NULL,NULL,NULL,0,'bronze',NULL,NULL,NULL);
INSERT INTO User VALUES('cmd2zn0zr0009z16zfmhuxxg5','school@test.com',1752490573767,'$2a$12$Nfub3vQ238vo8t8AMPvawuJdTFYG4mdyB/iBlIlJ4VbLBjpSDlpXi','Test Moto School',NULL,'SCHOOL_ADMIN',NULL,NULL,'cmd2zn03d0001z16zu03uq0uq',NULL,NULL,NULL,NULL,'FREE',NULL,1752490573768,1752490573768,NULL,NULL,NULL,NULL,0,'bronze',NULL,NULL,NULL);
INSERT INTO User VALUES('cmdkq3p6n0000z1e2sf7n602d','instructor@test.com',1753562946621,'$2a$10$6rev6LJvFPayZYCl8mIoEe.UnOds2WFQ0CnYJ.bOFnflMU3VeQin6','Test Instructor',NULL,'INSTRUCTOR',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FREE',NULL,1753562946622,1753906387994,1753572161326,NULL,NULL,NULL,0,'bronze',NULL,NULL,NULL);
INSERT INTO User VALUES('cmdkq3p870001z1e2ax989vd9','schooladmin@test.com',1753562946679,'$2a$10$RSQEEurb2lkn59XUXVE3z.ab3JooOb5Ct3z71XkfRgG2T/g9.mnZ2','School Admin',NULL,'SCHOOL_ADMIN',NULL,NULL,'cmdkq3p9s0002z1e2oip6c798',NULL,NULL,NULL,NULL,'FREE',NULL,1753562946680,1753906388108,NULL,NULL,NULL,NULL,0,'bronze',NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetUserId" TEXT,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "resource" TEXT,
    "resourceId" TEXT,
    "action" TEXT NOT NULL,
    "changes" TEXT,
    "oldValues" TEXT,
    "newValues" TEXT,
    "metadata" TEXT,
    "result" TEXT NOT NULL DEFAULT 'success',
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "UserStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO UserStats VALUES('cmdq7nukn0001z15bwtwq4nwq','cmd2zn03b0000z16zz3riko5y',0,1,0,0,0,NULL,1753894771079,1753894771079);
CREATE TABLE IF NOT EXISTS "DailyActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "minutesLearned" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "testsCompleted" INTEGER NOT NULL DEFAULT 0,
    "perfectScores" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requirement" JSONB NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 100,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Badge VALUES('cmdou0j7e0000z103qthkrbkb','streak_3_days','Початківець','Навчайся 3 дні поспіль','🔥','streak','{"type":"streak","days":3}',50,1,1,1753811382074,1753811382074);
INSERT INTO Badge VALUES('cmdou0j7g0001z103dwk16qnp','streak_7_days','Тижнева серія','Навчайся 7 днів поспіль','🔥','streak','{"type":"streak","days":7}',100,2,1,1753811382077,1753811382077);
INSERT INTO Badge VALUES('cmdou0j7h0002z103a4kj6vom','streak_30_days','Місяць дисципліни','Навчайся 30 днів поспіль','🔥','streak','{"type":"streak","days":30}',500,3,1,1753811382078,1753811382078);
INSERT INTO Badge VALUES('cmdou0j7i0003z103e7eiwamk','streak_100_days','Майстер дисципліни','Навчайся 100 днів поспіль','🏆','streak','{"type":"streak","days":100}',2000,4,1,1753811382078,1753811382078);
INSERT INTO Badge VALUES('cmdou0j7i0004z103p6d3h3hl','first_lesson','Перший крок','Пройди свій перший урок','🎯','achievement','{"type":"lessons_completed","count":1}',25,10,1,1753811382079,1753811382079);
INSERT INTO Badge VALUES('cmdou0j7j0005z103hgcbpg00','perfect_score','Ідеальний результат','Отримай 100% на тесті','💯','achievement','{"type":"perfect_test","count":1}',100,11,1,1753811382079,1753811382079);
INSERT INTO Badge VALUES('cmdou0j7j0006z1032925e2r2','fast_learner','Швидкий учень','Пройди 5 уроків за один день','⚡','achievement','{"type":"daily_lessons","count":5}',150,12,1,1753811382079,1753811382079);
INSERT INTO Badge VALUES('cmdou0j7k0007z103xofbgkws','night_owl','Нічна сова','Навчайся після 22:00','🦉','achievement','{"type":"time_based","hour_after":22}',75,13,1,1753811382080,1753811382080);
INSERT INTO Badge VALUES('cmdou0j7k0008z103n8cu4a92','early_bird','Ранкова пташка','Навчайся до 7:00','🐦','achievement','{"type":"time_based","hour_before":7}',75,14,1,1753811382080,1753811382080);
INSERT INTO Badge VALUES('cmdou0j7k0009z103fxfruddh','marathon_runner','Марафонець','Навчайся більше 2 годин поспіль','🏃','achievement','{"type":"session_duration","minutes":120}',200,15,1,1753811382081,1753811382081);
INSERT INTO Badge VALUES('cmdou0j7l000az103cioqss0b','level_5','Новачок','Досягни 5 рівня','⭐','skill','{"type":"level","value":5}',100,20,1,1753811382081,1753811382081);
INSERT INTO Badge VALUES('cmdou0j7l000bz1032ni3zie5','level_10','Учень','Досягни 10 рівня','⭐','skill','{"type":"level","value":10}',250,21,1,1753811382082,1753811382082);
INSERT INTO Badge VALUES('cmdou0j7m000cz1032fueeahf','level_20','Досвідчений','Досягни 20 рівня','⭐','skill','{"type":"level","value":20}',500,22,1,1753811382082,1753811382082);
INSERT INTO Badge VALUES('cmdou0j7m000dz103le9dj9l4','level_50','Майстер','Досягни 50 рівня','👑','skill','{"type":"level","value":50}',2500,23,1,1753811382083,1753811382083);
INSERT INTO Badge VALUES('cmdou0j7n000ez1031pl5chf6','beta_tester','Бета-тестер','Один з перших користувачів платформи','🚀','special','{"type":"special","condition":"beta"}',500,30,1,1753811382083,1753811382083);
INSERT INTO Badge VALUES('cmdou0j7n000fz1038t9j0qtc','social_butterfly','Соціальний метелик','Поділись досягненням в соцмережах','🦋','special','{"type":"social_share","count":1}',100,31,1,1753811382084,1753811382084);
INSERT INTO Badge VALUES('cmdou0j7o000gz103i6j746m2','safety_first','Безпека понад усе','Пройди всі курси з безпеки','🛡️','special','{"type":"course_category","category":"safety","all":true}',1000,32,1,1753811382084,1753811382084);
CREATE TABLE IF NOT EXISTS "UserBadge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 100,
    CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Leaderboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "perfectScores" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "previousRank" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "PSKPProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testResultId" TEXT NOT NULL,
    "primaryType" TEXT NOT NULL,
    "riskAwareness" INTEGER NOT NULL,
    "emotionalControl" INTEGER NOT NULL,
    "mainFears" TEXT,
    "compensationMechanisms" TEXT,
    "languagePatterns" TEXT,
    "metaphors" TEXT,
    "focusAreas" TEXT,
    "blindSpots" TEXT,
    "learningStyle" TEXT NOT NULL,
    "decisionMaking" TEXT NOT NULL,
    "stressResponse" TEXT NOT NULL,
    "experienceVsTheory" INTEGER NOT NULL,
    "socialIntegration" INTEGER NOT NULL,
    "groupBehavior" TEXT NOT NULL,
    "authorities" TEXT,
    "groupPressure" INTEGER NOT NULL,
    "overconfidenceScore" INTEGER NOT NULL,
    "accidentProbability" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PSKPProfile_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "explanation" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT,
    "timeLimit" INTEGER,
    "matchingPairs" TEXT,
    "orderingItems" TEXT,
    "acceptedAnswers" TEXT,
    "level" TEXT,
    "category" TEXT,
    "isHubQuestion" BOOLEAN NOT NULL DEFAULT false,
    "dependsOn" TEXT,
    "showConditions" TEXT,
    "multiChoice" BOOLEAN NOT NULL DEFAULT false,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Question VALUES('cmd2zn100000gz16zjpycvhbe','cmd2zn0zz000fz16z6wfd5tnk','Який головний елемент захисної екіпіровки мотоцикліста?','Шолом захищає найважливішу частину тіла - голову',NULL,NULL,'SINGLE_CHOICE',1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmd2zn100000lz16zqtq40jl5','cmd2zn0zz000fz16z6wfd5tnk','Яку дистанцію слід тримати за іншими транспортними засобами?','Безпечна дистанція дозволяє вчасно зреагувати на зміну ситуації',NULL,NULL,'SINGLE_CHOICE',1,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn1u0002z177wql1g72n','cmdu5xn1r0000z177mjjo9afd','[1] ПРОФІЛЬ РАЙДЕРА: Оціни свій рівень їзди (1-10):',NULL,NULL,NULL,'SINGLE_CHOICE',1,1,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn1x000cz177voix6siu','cmdu5xn1r0000z177mjjo9afd','[1] ПРОФІЛЬ РАЙДЕРА: Скільки сезонів активно катаєшся?',NULL,NULL,NULL,'SINGLE_CHOICE',1,2,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn1z000mz177wybipm7f','cmdu5xn1r0000z177mjjo9afd','[1] ПРОФІЛЬ РАЙДЕРА: Перед початком катання, як готувався до ризиків?',NULL,NULL,NULL,'SINGLE_CHOICE',1,3,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn21000wz177zo642sfk','cmdu5xn1r0000z177mjjo9afd','[1] ПРОФІЛЬ РАЙДЕРА: Скільки аварійних відео проаналізував?',NULL,NULL,NULL,'SINGLE_CHOICE',1,4,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn230018z1777ksa2r4g','cmdu5xn1r0000z177mjjo9afd','[1] ПРОФІЛЬ РАЙДЕРА: Були інциденти? (можна кілька)',NULL,NULL,NULL,'SINGLE_CHOICE',1,5,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn25001kz1773yexwey3','cmdu5xn1r0000z177mjjo9afd','[1] ПРОФІЛЬ РАЙДЕРА: Що викликає найбільший дискомфорт?',NULL,NULL,NULL,'SINGLE_CHOICE',1,6,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn27001wz177c73w1pzg','cmdu5xn1r0000z177mjjo9afd','[2] МІСЬКА СТРАТЕГІЯ: Під''їжджаєш до червоного світлофора, там 3 ряди з машинами. Куди стаєш?',NULL,NULL,NULL,'SINGLE_CHOICE',2,7,'ADVANCED',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn280026z1773424u5y1','cmdu5xn1r0000z177mjjo9afd','[2] МІСЬКА СТРАТЕГІЯ: З якою силою тримаєш кермо на швидкості?',NULL,NULL,NULL,'SINGLE_CHOICE',1,8,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2a002gz177n1b8u88m','cmdu5xn1r0000z177mjjo9afd','[2] МІСЬКА СТРАТЕГІЯ: Найнебезпечніші місця в місті:',NULL,NULL,NULL,'MULTIPLE_CHOICE',1,9,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2d002qz1770kfi6m2z','cmdu5xn1r0000z177mjjo9afd','[2] МІСЬКА СТРАТЕГІЯ: Дитина вибігає на дорогу за 15м (їдеш 50 км/год). Дії?',NULL,NULL,NULL,'SINGLE_CHOICE',2,10,'ADVANCED',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2e0030z177tanjos3n','cmdu5xn1r0000z177mjjo9afd','[2] МІСЬКА СТРАТЕГІЯ: В чому сенс принципу LLPP?',NULL,NULL,NULL,'SINGLE_CHOICE',1,11,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2g003az177z4o3jx6u','cmdu5xn1r0000z177mjjo9afd','[3] ТЕХНІКА ГАЛЬМУВАННЯ: Типова швидкість в місті?',NULL,NULL,NULL,'SINGLE_CHOICE',1,12,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2i003kz1777ofs3qfl','cmdu5xn1r0000z177mjjo9afd','[3] ТЕХНІКА ГАЛЬМУВАННЯ: Скільки метрів потрібно для зупинки з 60 км/год?',NULL,NULL,NULL,'SINGLE_CHOICE',1,13,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2j003uz177pqo89zlv','cmdu5xn1r0000z177mjjo9afd','[3] ТЕХНІКА ГАЛЬМУВАННЯ: Що робиш зі зчеплою при екстреному гальмуванні?',NULL,NULL,NULL,'SINGLE_CHOICE',2,14,'ADVANCED',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2l0044z177lie3mof9','cmdu5xn1r0000z177mjjo9afd','[3] ТЕХНІКА ГАЛЬМУВАННЯ: Заблокувалось переднє колесо. Дії?',NULL,NULL,NULL,'SINGLE_CHOICE',2,15,'ADVANCED',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2n004ez177eifyy3vn','cmdu5xn1r0000z177mjjo9afd','[3] ТЕХНІКА ГАЛЬМУВАННЯ: Що буде якщо гальмувати в повороті?',NULL,NULL,NULL,'SINGLE_CHOICE',1,16,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2o004oz177g8m22xrz','cmdu5xn1r0000z177mjjo9afd','[4] МАНЕВРУВАННЯ: Практикував спеціально екстрене гальмування?',NULL,NULL,NULL,'SINGLE_CHOICE',1,17,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2q004yz177vyq2bf7c','cmdu5xn1r0000z177mjjo9afd','[4] МАНЕВРУВАННЯ: Можеш проїхати в коліно?',NULL,NULL,NULL,'SINGLE_CHOICE',1,18,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2s0058z177caagp8zt','cmdu5xn1r0000z177mjjo9afd','[4] МАНЕВРУВАННЯ: Як виникає хайсайд?',NULL,NULL,NULL,'SINGLE_CHOICE',1,19,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2u005iz177t284zmon','cmdu5xn1r0000z177mjjo9afd','[4] МАНЕВРУВАННЯ: В повороті пісок. Дії?',NULL,NULL,NULL,'SINGLE_CHOICE',1,20,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2v005sz17706vamrhf','cmdu5xn1r0000z177mjjo9afd','[4] МАНЕВРУВАННЯ: В повороті перешкода + мокро. Що робиш?',NULL,NULL,NULL,'SINGLE_CHOICE',1,21,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2x0062z177qtjluxat','cmdu5xn1r0000z177mjjo9afd','[5] ЕКСТРЕМАЛЬНІ СИТУАЦІЇ: На швидкості 100+ починається wobble. Дії?',NULL,NULL,NULL,'SINGLE_CHOICE',2,22,'ADVANCED',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn2y006cz177vnc5d9my','cmdu5xn1r0000z177mjjo9afd','[5] ЕКСТРЕМАЛЬНІ СИТУАЦІЇ: Фура справа почала перестроюватись на тебе (2м). Дії?',NULL,NULL,NULL,'SINGLE_CHOICE',1,23,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn30006mz177dun3hylh','cmdu5xn1r0000z177mjjo9afd','[5] ЕКСТРЕМАЛЬНІ СИТУАЦІЇ: Їдеш вночі, фара світить на 40м. Максимальна безпечна швидкість?',NULL,NULL,NULL,'SINGLE_CHOICE',1,24,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdu5xn32006wz177bn5f0tc1','cmdu5xn1r0000z177mjjo9afd','[5] ЕКСТРЕМАЛЬНІ СИТУАЦІЇ: Тиск в шинах збільшити в 1.5 рази. Що буде?',NULL,NULL,NULL,'SINGLE_CHOICE',1,25,'INTERMEDIATE',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0001z1542ph8wwv9','cmdxjsv1b0000z1549bqlyog7','Оцініть свій рівень їзди від 1 до 10:','САМООЦІНКА',NULL,NULL,'open_text',0,1,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0002z154kqrctxm0','cmdxjsv1b0000z1549bqlyog7','Скільки сезонів/років активно їздите на мотоциклі?','САМООЦІНКА',NULL,NULL,'single_choice',2,2,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0007z154p4ue1n81','cmdxjsv1b0000z1549bqlyog7','Який у вас мотоцикл?','САМООЦІНКА',NULL,NULL,'open_text',0,3,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0008z154tmdkoxng','cmdxjsv1b0000z1549bqlyog7','Чи обладнаний ваш мотоцикл ABS?','САМООЦІНКА',NULL,NULL,'single_choice',2,4,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c000cz154mgbkso61','cmdxjsv1b0000z1549bqlyog7','В якій мотошколі навчались?','САМООЦІНКА',NULL,NULL,'open_text',0,5,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c000dz154p93jf40z','cmdxjsv1b0000z1549bqlyog7','Найскладніша ситуація, з якої вийшли:','САМООЦІНКА',NULL,NULL,'single_choice',2,6,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c000jz154a5z9tm2z','cmdxjsv1b0000z1549bqlyog7','Скільки у вас в середньому складних ситуацій в сезон які вимагають екстреного гальмування?','САМООЦІНКА',NULL,NULL,'single_choice',2,7,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c000pz154i3fvuspw','cmdxjsv1b0000z1549bqlyog7','Чи були вже серйозні аварії, падіння?','САМООЦІНКА',NULL,NULL,'open_text',0,8,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c000qz154elajepg3','cmdxjsv1b0000z1549bqlyog7','Яка у вас реалістична вілка швидкості на проспекті з малим трафіком?','САМООЦІНКА',NULL,NULL,'single_choice',2,9,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c000vz154md3opjej','cmdxjsv1b0000z1549bqlyog7','Чи думали над тим, що можете загинути на мотоциклі?','ПСИХІКА',NULL,NULL,'single_choice',2,10,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0010z154uof4x9jt','cmdxjsv1b0000z1549bqlyog7','Що робили для зменшення ризиків?','ПСИХІКА',NULL,NULL,'single_choice',2,11,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0016z1540oa0tfj3','cmdxjsv1b0000z1549bqlyog7','Чи дивились спеціально відео аварій або інші навчальні матеріали?','ПСИХІКА',NULL,NULL,'single_choice',2,12,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c001cz1543fjkwoub','cmdxjsv1b0000z1549bqlyog7','Їздите в екіпі?','ПСИХІКА',NULL,NULL,'single_choice',2,13,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c001hz154ej9nr8nz','cmdxjsv1b0000z1549bqlyog7','Що найбільше неприємно в місті?','СТРАТЕГІЯ',NULL,NULL,'open_text',0,14,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c001iz15443i0hyh4','cmdxjsv1b0000z1549bqlyog7','Підїжджаєте до світлофора, вам зелений - що робите?','СТРАТЕГІЯ',NULL,NULL,'single_choice',3,15,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c001nz154se4311dc','cmdxjsv1b0000z1549bqlyog7','В якій частині смуги зазвичай рухаєтесь?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,16,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c001sz154f7il04bq','cmdxjsv1b0000z1549bqlyog7','Які для вас найнебезпечніші ситуації в місті?','СТРАТЕГІЯ',NULL,NULL,'open_text',0,17,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c001tz1547h07cfmh','cmdxjsv1b0000z1549bqlyog7','Машина стоїть на виїзді з другорядної дороги, водій дивиться вам в очі. Що будете робити?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,18,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c001yz154gmbsrro2','cmdxjsv1b0000z1549bqlyog7','Хто винен, якщо вас збили на зеленому світлі на головній?','СТРАТЕГІЯ',NULL,NULL,'single_choice',3,19,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0022z1541cy2crn1','cmdxjsv1b0000z1549bqlyog7','Як часто вам "заважають" неправильні дії інші водії?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,20,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0027z154d85ghqbq','cmdxjsv1b0000z1549bqlyog7','Ви догнали вантажівку яка їде з вашою швидкістю 80 км/г. Що далі робити?','СТРАТЕГІЯ',NULL,NULL,'single_choice',3,21,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c002cz1547jxy564v','cmdxjsv1b0000z1549bqlyog7','Машина в середній смузі включає лівий поворотник. Що ви зробите?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,22,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c002hz154guzmmjmt','cmdxjsv1b0000z1549bqlyog7','Ви їдете 80 км/год. Де ви почнете прикривати газ?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,23,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c002mz154xfs2z3td','cmdxjsv1b0000z1549bqlyog7','Скільки метрів займе гальмування з 60 км/год?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,24,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c002sz154w8dgcmwn','cmdxjsv1b0000z1549bqlyog7','Скільки метрів займе гальмування з 100 км/год?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,25,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c002yz154963veg35','cmdxjsv1b0000z1549bqlyog7','Чи були випадки блокування колеса?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,26,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0033z154kx3tlrga','cmdxjsv1b0000z1549bqlyog7','Що робити при блокуванні переднього колеса?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,27,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0038z154nqscrdh0','cmdxjsv1b0000z1549bqlyog7','Що буде, якщо гальмувати в повороті?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,28,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c003dz154wx9cxw73','cmdxjsv1b0000z1549bqlyog7','Чи вмієте гальмувати і понижати передачі одночасно?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,29,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c003hz154l27yqdif','cmdxjsv1b0000z1549bqlyog7','Ви сильно гальмуєте. Відчуваєте що задня частина мотоцикла піднімається. Ваші дії?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,30,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c003mz1549aoes6fz','cmdxjsv1b0000z1549bqlyog7','Після 2 хвилин практики гальмування важіль гальма став м''якішим. Чому?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,31,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c003rz1548w70m4rj','cmdxjsv1b0000z1549bqlyog7','Який спосіб гальмування буде ефективніший з 100 км/год. Мотоцикл - стріт','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,32,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c003wz1540usqmjmz','cmdxjsv1b0000z1549bqlyog7','За скільки секунд реально зупинитись зі 100 км/год?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,33,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0042z1542pwaw86f','cmdxjsv1b0000z1549bqlyog7','Якщо асфальт буде ребристий і з бугорками на що це вплине?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,34,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0047z154zjlvn1qi','cmdxjsv1b0000z1549bqlyog7','Якщо вам екстренно гальмувати з високої швидкості і ви на високій передачі, наприклад 5й?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,35,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c004cz1546jl85g7z','cmdxjsv1b0000z1549bqlyog7','В місті ви зазвичай гальмуєте досить плавно і м''яко. В аварійній ситуації ви:','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,36,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c004hz154diwxs5g2','cmdxjsv1b0000z1549bqlyog7','Ви гальмуєте екстрено. Як тримати коліна?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,37,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c004mz1549crjzlpx','cmdxjsv1b0000z1549bqlyog7','Коли використовувати задні гальма?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,38,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c004sz154lm7r377o','cmdxjsv1b0000z1549bqlyog7','Чи розумієтесь на траєкторіях?','ПОВОРОТИ',NULL,NULL,'single_choice',2,39,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c004wz154yoev6vhc','cmdxjsv1b0000z1549bqlyog7','З якою швидкістю заходите на поворот на розв''язку?','ПОВОРОТИ',NULL,NULL,'single_choice',2,40,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0051z154ydogy21y','cmdxjsv1b0000z1549bqlyog7','Яка максимальна швидкість входу в повороті на розв''язці?','ПОВОРОТИ',NULL,NULL,'single_choice',2,41,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c0056z15400tavk90','cmdxjsv1b0000z1549bqlyog7','Чи знаєте граничний кут нахилу вашого мотоциклу?','ПОВОРОТИ',NULL,NULL,'single_choice',2,42,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c005az154ntyxg4g9','cmdxjsv1b0000z1549bqlyog7','Відчуваєте, що руки болять після їзди серпантином. Що це означає?','ПОВОРОТИ',NULL,NULL,'single_choice',2,43,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c005fz154vgaungg4','cmdxjsv1b0000z1549bqlyog7','В повороті відчули що заднє колесо починає сковзити. Ваша реакція?','ПОВОРОТИ',NULL,NULL,'single_choice',3,44,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1c005kz154tciqmwtn','cmdxjsv1b0000z1549bqlyog7','Входите в знайомий поворот і помічаєте пісок на асфальті. Перша дія?','ПОВОРОТИ',NULL,NULL,'single_choice',3,45,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d005pz1547wmku6ki','cmdxjsv1b0000z1549bqlyog7','З якою реальною швидкістю їздите по місту?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,46,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d005vz154gfz0h1u8','cmdxjsv1b0000z1549bqlyog7','Коли ви використовуєте дальнє світло в місті?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,47,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d0060z15407mqrgyp','cmdxjsv1b0000z1549bqlyog7','Як сильно тримаєте кермо?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,48,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d0064z154npnz86x2','cmdxjsv1b0000z1549bqlyog7','Чи їздите в міжрядді? Наскільки комфортно?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,49,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d006az1545g9z3kui','cmdxjsv1b0000z1549bqlyog7','Червоний. Три ряди машин стоять. Куди поїдете?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,50,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d006fz154imk8tt2y','cmdxjsv1b0000z1549bqlyog7','В досить швидкому міжрядді машина включила поворотник. На що дивитись?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,51,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d006kz1546n8bdebj','cmdxjsv1b0000z1549bqlyog7','Ви їдете в міжрядді і тачка попереду блокує. Що робити?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,52,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d006pz154p7uepnrr','cmdxjsv1b0000z1549bqlyog7','Ви не можете проїхати міжряддям бо заблоковано - що робимо?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,53,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d006uz154yw2156f9','cmdxjsv1b0000z1549bqlyog7','За вами в міжрядді наздоганяє інший мотоцикл. Що робити?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,54,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d006zz154kvgwqv8u','cmdxjsv1b0000z1549bqlyog7','Чому мотоциклісти встають на підніжки в заторі?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,55,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d0075z154kti2wm4s','cmdxjsv1b0000z1549bqlyog7','Які конкретні ситуації викликають дискомфорт?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'open_text',0,56,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d0076z1544gzpf0oj','cmdxjsv1b0000z1549bqlyog7','На швидкості 100+ wobble. Що робите?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,57,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d007cz154moe2lbxk','cmdxjsv1b0000z1549bqlyog7','Що тре зробити, якщо бачите пісок в повороті?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,58,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d007hz1544hb339np','cmdxjsv1b0000z1549bqlyog7','Гальмівний шлях на мокрому збільшується:','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,59,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d007mz1542j3l9dsq','cmdxjsv1b0000z1549bqlyog7','Для чого райдери ставлять гуму на бак?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,60,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d007rz154vp6k74nj','cmdxjsv1b0000z1549bqlyog7','Ваше ставлення до прямотоків (гучних вихлопних систем)?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,61,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d007wz1540l12rgkc','cmdxjsv1b0000z1549bqlyog7','Який тиск у ваших шинах?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',3,62,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d0080z154p0jagr9k','cmdxjsv1b0000z1549bqlyog7','Чи маєте досвід їзди в складних умовах?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,63,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d0085z154oth56q3j','cmdxjsv1b0000z1549bqlyog7','Чи маєте досвід джимхани або треку?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,64,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d008az1544sjzvatg','cmdxjsv1b0000z1549bqlyog7','Чи є друзі-мотоциклісти для порад?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,65,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d008fz154sdkzlion','cmdxjsv1b0000z1549bqlyog7','Чи катаєтесь з кимось?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,66,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d008jz154a15pxtko','cmdxjsv1b0000z1549bqlyog7','До кого звертаєтесь за технічними порадами?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,67,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdxjsv1d008oz1547zy8a9y1','cmdxjsv1b0000z1549bqlyog7','Чому досвідчені мотоциклісти НЕ тренують екстрене гальмування з великих швидкостей?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,68,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zl0001z19etfh1ropk','cmdya56zl0000z19eessucgau','Оцініть свій рівень їзди від 1 до 10:','САМООЦІНКА',NULL,NULL,'open_text',0,1,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zl0002z19ea7z5oo41','cmdya56zl0000z19eessucgau','Скільки сезонів/років активно їздите на мотоциклі?','САМООЦІНКА',NULL,NULL,'single_choice',2,2,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zl0007z19e37uqn911','cmdya56zl0000z19eessucgau','Який у вас мотоцикл?','САМООЦІНКА',NULL,NULL,'open_text',0,3,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0008z19eaj2xg4uz','cmdya56zl0000z19eessucgau','Чи обладнаний ваш мотоцикл ABS?','САМООЦІНКА',NULL,NULL,'single_choice',2,4,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm000cz19ebey58g8l','cmdya56zl0000z19eessucgau','В якій мотошколі навчались?','САМООЦІНКА',NULL,NULL,'open_text',0,5,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm000dz19e396t3m3k','cmdya56zl0000z19eessucgau','Найскладніша ситуація, з якої вийшли:','САМООЦІНКА',NULL,NULL,'single_choice',2,6,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm000jz19e8nogjpd7','cmdya56zl0000z19eessucgau','Скільки у вас в середньому складних ситуацій в сезон які вимагають екстреного гальмування?','САМООЦІНКА',NULL,NULL,'single_choice',2,7,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm000pz19e4dp6lcfz','cmdya56zl0000z19eessucgau','Чи були вже серйозні аварії, падіння?','САМООЦІНКА',NULL,NULL,'open_text',0,8,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm000qz19etdcanjuh','cmdya56zl0000z19eessucgau','Яка у вас реалістична вілка швидкості на проспекті з малим трафіком?','САМООЦІНКА',NULL,NULL,'single_choice',2,9,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm000vz19e8w2a17sn','cmdya56zl0000z19eessucgau','Чи думали над тим, що можете загинути на мотоциклі?','ПСИХІКА',NULL,NULL,'single_choice',2,10,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0010z19e9e696p55','cmdya56zl0000z19eessucgau','Що робили для зменшення ризиків?','ПСИХІКА',NULL,NULL,'single_choice',2,11,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0016z19e346weya9','cmdya56zl0000z19eessucgau','Чи дивились спеціально відео аварій або інші навчальні матеріали?','ПСИХІКА',NULL,NULL,'single_choice',2,12,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm001cz19epjk8w3fz','cmdya56zl0000z19eessucgau','Їздите в екіпі?','ПСИХІКА',NULL,NULL,'single_choice',2,13,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm001hz19e7itx37e6','cmdya56zl0000z19eessucgau','Що найбільше неприємно в місті?','СТРАТЕГІЯ',NULL,NULL,'open_text',0,14,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm001iz19evq36r1aw','cmdya56zl0000z19eessucgau','Підїжджаєте до світлофора, вам зелений - що робите?','СТРАТЕГІЯ',NULL,NULL,'single_choice',3,15,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm001nz19ec013wmtn','cmdya56zl0000z19eessucgau','В якій частині смуги зазвичай рухаєтесь?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,16,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm001sz19erivfc7z2','cmdya56zl0000z19eessucgau','Які для вас найнебезпечніші ситуації в місті?','СТРАТЕГІЯ',NULL,NULL,'open_text',0,17,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm001tz19eq83h8ly2','cmdya56zl0000z19eessucgau','Машина стоїть на виїзді з другорядної дороги, водій дивиться вам в очі. Що будете робити?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,18,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm001yz19eobmzrcvb','cmdya56zl0000z19eessucgau','Хто винен, якщо вас збили на зеленому світлі на головній?','СТРАТЕГІЯ',NULL,NULL,'single_choice',3,19,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0022z19entejbc8q','cmdya56zl0000z19eessucgau','Як часто вам "заважають" неправильні дії інші водії?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,20,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0027z19ew035fumn','cmdya56zl0000z19eessucgau','Ви догнали вантажівку яка їде з вашою швидкістю 80 км/г. Що далі робити?','СТРАТЕГІЯ',NULL,NULL,'single_choice',3,21,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm002cz19ep9ljjmqq','cmdya56zl0000z19eessucgau','Машина в середній смузі включає лівий поворотник. Що ви зробите?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,22,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm002hz19en1ptoleo','cmdya56zl0000z19eessucgau','Ви їдете 80 км/год. Де ви почнете прикривати газ?','СТРАТЕГІЯ',NULL,NULL,'single_choice',2,23,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm002mz19e72zlyl47','cmdya56zl0000z19eessucgau','Скільки метрів займе гальмування з 60 км/год?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,24,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm002sz19ehb5737hr','cmdya56zl0000z19eessucgau','Скільки метрів займе гальмування з 100 км/год?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,25,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm002yz19etb2qisyo','cmdya56zl0000z19eessucgau','Чи були випадки блокування колеса?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,26,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0033z19exx2xyu33','cmdya56zl0000z19eessucgau','Що робити при блокуванні переднього колеса?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,27,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0038z19e6raxjr6i','cmdya56zl0000z19eessucgau','Що буде, якщо гальмувати в повороті?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,28,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm003dz19el1ea1coi','cmdya56zl0000z19eessucgau','Чи вмієте гальмувати і понижати передачі одночасно?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,29,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm003hz19e93v0u36m','cmdya56zl0000z19eessucgau','Ви сильно гальмуєте. Відчуваєте що задня частина мотоцикла піднімається. Ваші дії?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,30,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm003mz19eitz3p6rx','cmdya56zl0000z19eessucgau','Після 2 хвилин практики гальмування важіль гальма став м''якішим. Чому?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,31,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm003rz19elbjdrl80','cmdya56zl0000z19eessucgau','Який спосіб гальмування буде ефективніший з 100 км/год. Мотоцикл - стріт','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,32,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm003wz19ei0n6o3rc','cmdya56zl0000z19eessucgau','За скільки секунд реально зупинитись зі 100 км/год?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,33,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0042z19eqdsl8m97','cmdya56zl0000z19eessucgau','Якщо асфальт буде ребристий і з бугорками на що це вплине?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,34,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0047z19e9mffd47r','cmdya56zl0000z19eessucgau','Якщо вам екстренно гальмувати з високої швидкості і ви на високій передачі, наприклад 5й?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,35,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm004cz19ezwg0m9s9','cmdya56zl0000z19eessucgau','В місті ви зазвичай гальмуєте досить плавно і м''яко. В аварійній ситуації ви:','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',3,36,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm004hz19ejryy5y1q','cmdya56zl0000z19eessucgau','Ви гальмуєте екстрено. Як тримати коліна?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,37,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm004mz19ejrncwx07','cmdya56zl0000z19eessucgau','Коли використовувати задні гальма?','ГАЛЬМУВАННЯ',NULL,NULL,'single_choice',2,38,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm004sz19eqqmr2ftk','cmdya56zl0000z19eessucgau','Чи розумієтесь на траєкторіях?','ПОВОРОТИ',NULL,NULL,'single_choice',2,39,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm004wz19e3pfampvx','cmdya56zl0000z19eessucgau','З якою швидкістю заходите на поворот на розв''язку?','ПОВОРОТИ',NULL,NULL,'single_choice',2,40,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0051z19eddyvgldg','cmdya56zl0000z19eessucgau','Яка максимальна швидкість входу в повороті на розв''язці?','ПОВОРОТИ',NULL,NULL,'single_choice',2,41,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm0056z19e89eeueq9','cmdya56zl0000z19eessucgau','Чи знаєте граничний кут нахилу вашого мотоциклу?','ПОВОРОТИ',NULL,NULL,'single_choice',2,42,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zm005az19eg1ya838c','cmdya56zl0000z19eessucgau','Відчуваєте, що руки болять після їзди серпантином. Що це означає?','ПОВОРОТИ',NULL,NULL,'single_choice',2,43,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn005fz19e6ndafe8n','cmdya56zl0000z19eessucgau','В повороті відчули що заднє колесо починає сковзити. Ваша реакція?','ПОВОРОТИ',NULL,NULL,'single_choice',3,44,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn005kz19emned8via','cmdya56zl0000z19eessucgau','Входите в знайомий поворот і помічаєте пісок на асфальті. Перша дія?','ПОВОРОТИ',NULL,NULL,'single_choice',3,45,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn005pz19e8e9k6j1p','cmdya56zl0000z19eessucgau','З якою реальною швидкістю їздите по місту?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,46,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn005vz19ebp4195me','cmdya56zl0000z19eessucgau','Коли ви використовуєте дальнє світло в місті?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,47,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn0060z19e8fx994ea','cmdya56zl0000z19eessucgau','Як сильно тримаєте кермо?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,48,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn0064z19eltu5y7p8','cmdya56zl0000z19eessucgau','Чи їздите в міжрядді? Наскільки комфортно?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,49,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn006az19eji78k0ed','cmdya56zl0000z19eessucgau','Червоний. Три ряди машин стоять. Куди поїдете?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,50,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn006fz19e436t3ccg','cmdya56zl0000z19eessucgau','В досить швидкому міжрядді машина включила поворотник. На що дивитись?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,51,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn006kz19et6hyrzuc','cmdya56zl0000z19eessucgau','Ви їдете в міжрядді і тачка попереду блокує. Що робити?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,52,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn006pz19eqii5unmf','cmdya56zl0000z19eessucgau','Ви не можете проїхати міжряддям бо заблоковано - що робимо?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,53,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn006uz19eot9ms1rq','cmdya56zl0000z19eessucgau','За вами в міжрядді наздоганяє інший мотоцикл. Що робити?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,54,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn006zz19ezn3inj77','cmdya56zl0000z19eessucgau','Чому мотоциклісти встають на підніжки в заторі?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,55,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn0075z19e95szyr6o','cmdya56zl0000z19eessucgau','Які конкретні ситуації викликають дискомфорт?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'open_text',0,56,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn0076z19etw0dv6l9','cmdya56zl0000z19eessucgau','На швидкості 100+ wobble. Що робите?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,57,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn007cz19e3syrg7zf','cmdya56zl0000z19eessucgau','Що тре зробити, якщо бачите пісок в повороті?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',3,58,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn007hz19ex1prpwcw','cmdya56zl0000z19eessucgau','Гальмівний шлях на мокрому збільшується:','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,59,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn007mz19eiu0vx8cv','cmdya56zl0000z19eessucgau','Для чого райдери ставлять гуму на бак?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,60,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn007rz19esz4qj6hu','cmdya56zl0000z19eessucgau','Ваше ставлення до прямотоків (гучних вихлопних систем)?','МІСЬКІ СИТУАЦІЇ',NULL,NULL,'single_choice',2,61,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn007wz19e5jl1djj1','cmdya56zl0000z19eessucgau','Який тиск у ваших шинах?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',3,62,'critical',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn0080z19eu430i0sy','cmdya56zl0000z19eessucgau','Чи маєте досвід їзди в складних умовах?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,63,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn0085z19e37go8kdf','cmdya56zl0000z19eessucgau','Чи маєте досвід джимхани або треку?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,64,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn008az19e21pbns6b','cmdya56zl0000z19eessucgau','Чи є друзі-мотоциклісти для порад?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,65,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn008fz19e8zqu24cu','cmdya56zl0000z19eessucgau','Чи катаєтесь з кимось?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,66,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn008jz19eqxdpos16','cmdya56zl0000z19eessucgau','До кого звертаєтесь за технічними порадами?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,67,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdya56zn008oz19eiofija16','cmdya56zl0000z19eessucgau','Чому досвідчені мотоциклісти НЕ тренують екстрене гальмування з великих швидкостей?','НАВИЧКИ ТА ДОСВІД',NULL,NULL,'single_choice',2,68,'normal',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlnu0002z1m9o03q5le7','cmdyrrlnp0000z1m90mn0wahp','ФІО',NULL,NULL,NULL,'text',0,1,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 0: ІДЕНТИФІКАЦІЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlnv0004z1m9c1rud26o','cmdyrrlnp0000z1m90mn0wahp','Місто',NULL,NULL,NULL,'text',0,2,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 0: ІДЕНТИФІКАЦІЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlnw0006z1m9jpydwlbg','cmdyrrlnp0000z1m90mn0wahp','Контакти (телефон/email)',NULL,NULL,NULL,'text',0,3,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 0: ІДЕНТИФІКАЦІЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlnx0008z1m9j7evnbgj','cmdyrrlnp0000z1m90mn0wahp','Чому почали кататись?',NULL,NULL,NULL,'single_choice',1,4,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlo1000kz1m9o5xeghto','cmdyrrlnp0000z1m90mn0wahp','Хто вас навчав?',NULL,NULL,NULL,'single_choice',1,5,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlo60014z1m9sxrd0wdy','cmdyrrlnp0000z1m90mn0wahp','Який у вас мотоцикл? (Марка/Модель/Рік/Об''єм)',NULL,NULL,NULL,'text',1,6,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlo70016z1m9jfoyeght','cmdyrrlnp0000z1m90mn0wahp','Скільки сезонів/років активно їздите?',NULL,NULL,NULL,'single_choice',3,7,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 1: МОТИВАЦІЯ ТА ІСТОРІЯ',1,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlob001gz1m9gyvqkfsj','cmdyrrlnp0000z1m90mn0wahp','Оцініть свій рівень їзди від 1 до 10',NULL,NULL,NULL,'text',1,8,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 2: САМООЦІНКА ТА ДОСВІД',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrloc001iz1m9t0m8nmpi','cmdyrrlnp0000z1m90mn0wahp','Що найбільше лякає в їзді?',NULL,NULL,NULL,'text',1,9,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 2: САМООЦІНКА ТА ДОСВІД',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlod001kz1m9mmed1o99','cmdyrrlnp0000z1m90mn0wahp','Від чого отримуєте найбільше задоволення?',NULL,NULL,NULL,'text',1,10,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 2: САМООЦІНКА ТА ДОСВІД',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrloe001mz1m9st4s7x52','cmdyrrlnp0000z1m90mn0wahp','Чи були вже складні ситуації?',NULL,NULL,NULL,'single_choice',2,11,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 2: САМООЦІНКА ТА ДОСВІД',1,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrloh001yz1m93ik6uvb3','cmdyrrlnp0000z1m90mn0wahp','Скільки складних ситуацій в сезон?',NULL,NULL,NULL,'single_choice',2,12,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 2: САМООЦІНКА ТА ДОСВІД',0,'q2_4','{"q2_4":["Екстрене гальмування","Уникнення від перестроювання маневром","Втрата балансу/падіння","Багато вже було (5+)"]}',0,0);
INSERT INTO Question VALUES('cmdyrrlok002az1m9k9v77kwj','cmdyrrlnp0000z1m90mn0wahp','Опишіть найскладнішу ситуацію детально',NULL,NULL,NULL,'text',3,13,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 2: САМООЦІНКА ТА ДОСВІД',0,'q2_4','{"q2_4":["Екстрене гальмування","Уникнення від перестроювання маневром","Втрата балансу/падіння","Багато вже було (5+)"]}',0,0);
INSERT INTO Question VALUES('cmdyrrlol002cz1m9x0u03cpx','cmdyrrlnp0000z1m90mn0wahp','Як оцінюєте небезпеку? Чи думаєте що можете загинути/бути покаліченим?',NULL,NULL,NULL,'single_choice',3,14,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 3: ПСИХОЛОГІЯ ТА РИЗИКИ',0,NULL,NULL,0,1);
INSERT INTO Question VALUES('cmdyrrlon002kz1m9wp1dmqp3','cmdyrrlnp0000z1m90mn0wahp','Що найбільше дискомфортить в місті?',NULL,NULL,NULL,'multiple_choice',2,15,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 3: ПСИХОЛОГІЯ ТА РИЗИКИ',0,NULL,NULL,1,0);
INSERT INTO Question VALUES('cmdyrrloq0030z1m9275prczv','cmdyrrlnp0000z1m90mn0wahp','Що робили для зменшення ризиків?',NULL,NULL,NULL,'multiple_choice',3,16,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 3: ПСИХОЛОГІЯ ТА РИЗИКИ',1,NULL,NULL,1,0);
INSERT INTO Question VALUES('cmdyrrlou003iz1m9pdw09903','cmdyrrlnp0000z1m90mn0wahp','Що робите на світлофорі?',NULL,NULL,NULL,'single_choice',2,17,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 4: МІСЬКА СТРАТЕГІЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlox003sz1m9heunvf1r','cmdyrrlnp0000z1m90mn0wahp','В якій частині смуги зазвичай рухаєтесь?',NULL,NULL,NULL,'single_choice',3,18,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 4: МІСЬКА СТРАТЕГІЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrloz0042z1m9hfvqyak5','cmdyrrlnp0000z1m90mn0wahp','Які найнебезпечніші ситуації в місті на ваш погляд?',NULL,NULL,NULL,'multiple_choice',2,19,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 4: МІСЬКА СТРАТЕГІЯ',0,NULL,NULL,1,0);
INSERT INTO Question VALUES('cmdyrrlp3004iz1m9d2j7ortw','cmdyrrlnp0000z1m90mn0wahp','Чи легко вам їхати в міжрядді?',NULL,NULL,NULL,'single_choice',2,20,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 5: МІЖРЯДДЯ',1,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlp5004uz1m9cilm79h5','cmdyrrlnp0000z1m90mn0wahp','На якій швидкості в міжрядді?',NULL,NULL,NULL,'single_choice',2,21,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 5: МІЖРЯДДЯ',0,'q5_1','{"q5_1":["Складно, некомфортно","Нормально, але напружено","Легко, комфортно","Дуже легко, як риба у воді"]}',0,0);
INSERT INTO Question VALUES('cmdyrrlp70054z1m9wmm8zh61','cmdyrrlnp0000z1m90mn0wahp','Як контролюєте швидкість в міжрядді?',NULL,NULL,NULL,'single_choice',2,22,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 5: МІЖРЯДДЯ',0,'q5_1','{"q5_1":["Складно, некомфортно","Нормально, але напружено","Легко, комфортно","Дуже легко, як риба у воді"]}',0,0);
INSERT INTO Question VALUES('cmdyrrlp9005ez1m9cuwturjo','cmdyrrlnp0000z1m90mn0wahp','На що дивитесь в міжрядді?',NULL,NULL,NULL,'single_choice',3,23,NULL,NULL,NULL,NULL,NULL,'ADVANCED','БЛОК 5: МІЖРЯДДЯ',0,'q5_1','{"q5_1":["Легко, комфортно","Дуже легко, як риба у воді"],"q1_4":["3-7 сезонів","7+ сезонів"]}',0,0);
INSERT INTO Question VALUES('cmdyrrlpc005qz1m9euhhdvcb','cmdyrrlnp0000z1m90mn0wahp','З якою швидкістю зазвичай їздите в місті?',NULL,NULL,NULL,'single_choice',2,24,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlpe0062z1m9luanwjq3','cmdyrrlnp0000z1m90mn0wahp','Як зазвичай гальмуєте?',NULL,NULL,NULL,'single_choice',2,25,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlpg006cz1m9jsgw8lt0','cmdyrrlnp0000z1m90mn0wahp','Скільки метрів гальмування з 100 км/год?',NULL,NULL,NULL,'single_choice',3,26,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',0,'q3_3','{"q3_3":["Тренував гальмування"]}',0,1);
INSERT INTO Question VALUES('cmdyrrlpi006oz1m9d083s0lh','cmdyrrlnp0000z1m90mn0wahp','Чи блокували колеса?',NULL,NULL,NULL,'single_choice',2,27,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlpk006yz1m9r4nqtce8','cmdyrrlnp0000z1m90mn0wahp','Що робити якщо заблокувалось переднє колесо?',NULL,NULL,NULL,'single_choice',3,28,NULL,NULL,NULL,NULL,NULL,'ADVANCED','БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',0,'q6_4','{"q6_4":["Так, переднє","Обидва блокував"]}',0,1);
INSERT INTO Question VALUES('cmdyrrlpm0078z1m9qp2fwepa','cmdyrrlnp0000z1m90mn0wahp','Що буде якщо гальмувати в повороті?',NULL,NULL,NULL,'single_choice',3,29,NULL,NULL,NULL,NULL,NULL,'ADVANCED','БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',0,NULL,NULL,0,1);
INSERT INTO Question VALUES('cmdyrrlpo007iz1m962vwnafd','cmdyrrlnp0000z1m90mn0wahp','Чи гальмували в дощ?',NULL,NULL,NULL,'single_choice',2,30,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlpq007sz1m9z1nwke3j','cmdyrrlnp0000z1m90mn0wahp','Як використовуєте задні гальма?',NULL,NULL,NULL,'single_choice',2,31,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 6: ШВИДКІСТЬ ТА ГАЛЬМУВАННЯ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlps0086z1m9p8kktbpz','cmdyrrlnp0000z1m90mn0wahp','Страх розворотів з вивернутим кермом?',NULL,NULL,NULL,'single_choice',2,32,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlpu008gz1m9v8v8oyyn','cmdyrrlnp0000z1m90mn0wahp','Досвід джимхани або треку?',NULL,NULL,NULL,'single_choice',2,33,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlpw008qz1m98o57k3ta','cmdyrrlnp0000z1m90mn0wahp','Чи знаєте ваш граничний кут нахилу?',NULL,NULL,NULL,'single_choice',3,34,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',1,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlpy0090z1m9ix3kdmg9','cmdyrrlnp0000z1m90mn0wahp','Як їдете в повороті (траєкторія)?',NULL,NULL,NULL,'single_choice',3,35,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlq0009az1m9z2ao05qv','cmdyrrlnp0000z1m90mn0wahp','Чи знаєте як гальмувати в повороті?',NULL,NULL,NULL,'single_choice',3,36,NULL,NULL,NULL,NULL,NULL,'ADVANCED','БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',0,'q7_3','{"q7_3":["Так, точно знаю","Приблизно уявляю"]}',0,0);
INSERT INTO Question VALUES('cmdyrrlq2009kz1m9o3rp5yi8','cmdyrrlnp0000z1m90mn0wahp','Максимальна швидкість входу в поворот на розв''язці?',NULL,NULL,NULL,'single_choice',2,37,NULL,NULL,NULL,NULL,NULL,'ADVANCED','БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',0,'q7_2','{"q7_2":["Трохи джимхани","Трохи треку","Обидва регулярно"]}',0,0);
INSERT INTO Question VALUES('cmdyrrlq4009uz1m9qixzifa4','cmdyrrlnp0000z1m90mn0wahp','Чи є дискомфорт при дуже крутому повороті?',NULL,NULL,NULL,'single_choice',2,38,NULL,NULL,NULL,NULL,NULL,'ADVANCED','БЛОК 7: ПОВОРОТИ ТА МАНЕВРИ',0,'q7_3','{"q7_3":["Так, точно знаю","Приблизно уявляю"]}',0,0);
INSERT INTO Question VALUES('cmdyrrlq600a4z1m9p9bt1k9t','cmdyrrlnp0000z1m90mn0wahp','Використання дальнього світла в місті?',NULL,NULL,NULL,'single_choice',2,39,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlq800aez1m9lzxv1ifh','cmdyrrlnp0000z1m90mn0wahp','Як сильно тримаєте кермо?',NULL,NULL,NULL,'single_choice',3,40,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',0,NULL,NULL,0,1);
INSERT INTO Question VALUES('cmdyrrlq900amz1m99axpsuzw','cmdyrrlnp0000z1m90mn0wahp','Куди стаєте на червоному?',NULL,NULL,NULL,'single_choice',2,41,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlqb00awz1m9v6ifjgw9','cmdyrrlnp0000z1m90mn0wahp','Чому мотоциклісти встають на підніжки?',NULL,NULL,NULL,'single_choice',3,42,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',0,NULL,NULL,0,1);
INSERT INTO Question VALUES('cmdyrrlqd00b8z1m9o6rfbpla','cmdyrrlnp0000z1m90mn0wahp','Навіщо гума на баку?',NULL,NULL,NULL,'single_choice',2,43,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlqf00biz1m9znf9ybrl','cmdyrrlnp0000z1m90mn0wahp','Чи їздите швидше в групі?',NULL,NULL,NULL,'single_choice',2,44,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlqh00bqz1m9jsb0fpaj','cmdyrrlnp0000z1m90mn0wahp','Пасажира вже катали?',NULL,NULL,NULL,'single_choice',1,45,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 8: СОЦІАЛЬНІ АСПЕКТИ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlqj00c0z1m9f2j7akn5','cmdyrrlnp0000z1m90mn0wahp','Який тиск в шинах?',NULL,NULL,NULL,'single_choice',3,46,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',0,NULL,NULL,0,1);
INSERT INTO Question VALUES('cmdyrrlqk00c8z1m9te8amehr','cmdyrrlnp0000z1m90mn0wahp','Чи є механік/СТО?',NULL,NULL,NULL,'single_choice',1,47,NULL,NULL,NULL,NULL,NULL,'BASIC','БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlqm00ciz1m9rtzr7g1t','cmdyrrlnp0000z1m90mn0wahp','Досвід складних умов?',NULL,NULL,NULL,'single_choice',2,48,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlqn00cqz1m9jtmwhuw2','cmdyrrlnp0000z1m90mn0wahp','Записуєте поїздки на камеру?',NULL,NULL,NULL,'single_choice',2,49,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',0,NULL,NULL,0,0);
INSERT INTO Question VALUES('cmdyrrlqp00d0z1m9x14cpbpk','cmdyrrlnp0000z1m90mn0wahp','Плануєте маршрути заздалегідь?',NULL,NULL,NULL,'single_choice',2,50,NULL,NULL,NULL,NULL,NULL,'INTERMEDIATE','БЛОК 9: ТЕХНІЧНІ ТА НАВЧАЛЬНІ',0,NULL,NULL,0,0);
CREATE TABLE IF NOT EXISTS "Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentId" TEXT,
    "lessonId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passingScore" INTEGER NOT NULL DEFAULT 80,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER,
    "showCorrectAnswers" BOOLEAN NOT NULL DEFAULT true,
    "allowBackNavigation" BOOLEAN NOT NULL DEFAULT true,
    "randomizeQuestions" BOOLEAN NOT NULL DEFAULT false,
    "randomizeAnswers" BOOLEAN NOT NULL DEFAULT false,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isAdaptive" BOOLEAN NOT NULL DEFAULT false,
    "testType" TEXT,
    "totalQuestions" INTEGER,
    "minQuestions" INTEGER,
    "maxQuestions" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Test_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Test_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Test VALUES('cmd2zn0zz000fz16z6wfd5tnk','cmd2zn0zy000dz16zxdvudr0h',NULL,'Тест з основ безпеки','Перевірте свої знання основних правил безпеки на мотоциклі',80,10,3,1,1,0,0,0,0,NULL,NULL,NULL,NULL,1752490573776,1752490573776);
INSERT INTO Test VALUES('cmdu5xn1r0000z177mjjo9afd',NULL,NULL,'ФІНАЛЬНИЙ ТЕСТ РАЙДЕРА','{"originalDescription":"Комплексний тест для оцінки реального рівня навичок райдера","blocks":[{"id":"block-1","title":"ПРОФІЛЬ РАЙДЕРА","emoji":"[1]"},{"id":"block-2","title":"МІСЬКА СТРАТЕГІЯ","emoji":"[2]"},{"id":"block-3","title":"ТЕХНІКА ГАЛЬМУВАННЯ","emoji":"[3]"},{"id":"block-4","title":"МАНЕВРУВАННЯ","emoji":"[4]"},{"id":"block-5","title":"ЕКСТРЕМАЛЬНІ СИТУАЦІЇ","emoji":"[5]"}],"scoring":{"levels":[{"level":1,"range":[0,4],"title":"Level 1","description":"Не готовий до міста"},{"level":2,"range":[5,8],"title":"Level 2","description":"Початківець"},{"level":3,"range":[9,12],"title":"Level 3","description":"Небезпечна зона"},{"level":4,"range":[13,16],"title":"Level 4","description":"Базовий рівень безпеки"},{"level":5,"range":[17,20],"title":"Level 5-6","description":"Компетентний"},{"level":7,"range":[21,25],"title":"Level 7-8","description":"Дійсно досвідчений"}],"criticalQuestions":[7,10,14,15,22],"criticalPenalty":1},"metadata":{"totalQuestions":25,"estimatedTime":38,"difficulty":"INTERMEDIATE","category":"motorcycle-safety"}}',60,38,3,1,1,0,0,0,0,NULL,NULL,NULL,NULL,1754133733360,1754133733408);
INSERT INTO Test VALUES('cmdxjsv1b0000z1549bqlyog7',NULL,NULL,'Тест оцінки компетенції мотоцикліста V1.0','Інтерактивна система оцінки компетенцій для мотоциклістів. 68 питань, 7 блоків компетенцій, персоналізовані рекомендації.',60,30,NULL,1,1,0,0,0,0,NULL,NULL,NULL,NULL,1754338423582,1754338423582);
INSERT INTO Test VALUES('cmdya56zl0000z19eessucgau',NULL,NULL,'Тест оцінки компетенції мотоцикліста V1.0','Інтерактивна система оцінки компетенцій для мотоциклістів. 68 питань, 7 блоків компетенцій, персоналізовані рекомендації.',60,30,NULL,1,1,0,0,0,0,NULL,NULL,NULL,NULL,1754382668960,1754382668960);
INSERT INTO Test VALUES('cmdyrrlnp0000z1m90mn0wahp',NULL,NULL,'Тест компетенцій мотоцикліста V2.0 (Адаптивний)','Адаптивний тест з 47 питань для оцінки компетенцій мотоциклістів. Включає психологічний профіль ПСКП.',60,30,NULL,1,1,0,0,0,1,'COMPETENCY_V2',47,15,47,1754412267877,1754412267877);
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");
CREATE INDEX "PasswordReset_email_idx" ON "PasswordReset"("email");
CREATE INDEX "PasswordReset_token_idx" ON "PasswordReset"("token");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");
CREATE INDEX "School_slug_idx" ON "School"("slug");
CREATE INDEX "School_deletedAt_idx" ON "School"("deletedAt");
CREATE INDEX "SchoolGroup_schoolId_idx" ON "SchoolGroup"("schoolId");
CREATE UNIQUE INDEX "Content_kbNebId_key" ON "Content"("kbNebId");
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");
CREATE INDEX "Content_slug_idx" ON "Content"("slug");
CREATE INDEX "Content_type_status_idx" ON "Content"("type", "status");
CREATE INDEX "Content_isPublished_isPremium_idx" ON "Content"("isPublished", "isPremium");
CREATE INDEX "Content_deletedAt_idx" ON "Content"("deletedAt");
CREATE INDEX "ContentTranslation_language_idx" ON "ContentTranslation"("language");
CREATE UNIQUE INDEX "ContentTranslation_contentId_language_key" ON "ContentTranslation"("contentId", "language");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_language_key" ON "CategoryTranslation"("categoryId", "language");
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
CREATE INDEX "Course_slug_idx" ON "Course"("slug");
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");
CREATE INDEX "Course_instructorId_idx" ON "Course"("instructorId");
CREATE INDEX "Course_deletedAt_idx" ON "Course"("deletedAt");
CREATE UNIQUE INDEX "CourseTranslation_courseId_language_key" ON "CourseTranslation"("courseId", "language");
CREATE INDEX "CourseSection_courseId_idx" ON "CourseSection"("courseId");
CREATE INDEX "CourseSectionItem_sectionId_idx" ON "CourseSectionItem"("sectionId");
CREATE INDEX "CourseSectionItem_contentId_idx" ON "CourseSectionItem"("contentId");
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");
CREATE INDEX "Enrollment_courseId_idx" ON "Enrollment"("courseId");
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");
CREATE INDEX "CourseReview_courseId_idx" ON "CourseReview"("courseId");
CREATE UNIQUE INDEX "CourseReview_courseId_userId_key" ON "CourseReview"("courseId", "userId");
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");
CREATE INDEX "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");
CREATE INDEX "UserProgress_contentId_idx" ON "UserProgress"("contentId");
CREATE INDEX "UserProgress_lessonId_idx" ON "UserProgress"("lessonId");
CREATE UNIQUE INDEX "UserProgress_userId_contentId_key" ON "UserProgress"("userId", "contentId");
CREATE UNIQUE INDEX "UserProgress_userId_lessonId_key" ON "UserProgress"("userId", "lessonId");
CREATE INDEX "TestResult_userId_idx" ON "TestResult"("userId");
CREATE INDEX "TestResult_testId_idx" ON "TestResult"("testId");
CREATE INDEX "TestResult_completedAt_idx" ON "TestResult"("completedAt");
CREATE INDEX "TestResult_passed_idx" ON "TestResult"("passed");
CREATE INDEX "TestResult_userId_testId_idx" ON "TestResult"("userId", "testId");
CREATE INDEX "UserAnswer_testResultId_idx" ON "UserAnswer"("testResultId");
CREATE INDEX "UserAnswer_questionId_idx" ON "UserAnswer"("questionId");
CREATE INDEX "UserAnswer_isCorrect_idx" ON "UserAnswer"("isCorrect");
CREATE UNIQUE INDEX "Certificate_testResultId_key" ON "Certificate"("testResultId");
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");
CREATE INDEX "Certificate_certificateNumber_idx" ON "Certificate"("certificateNumber");
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");
CREATE INDEX "Notification_priority_idx" ON "Notification"("priority");
CREATE INDEX "Notification_expiresAt_idx" ON "Notification"("expiresAt");
CREATE INDEX "KBNebSync_status_idx" ON "KBNebSync"("status");
CREATE INDEX "KBNebSyncItem_syncId_idx" ON "KBNebSyncItem"("syncId");
CREATE UNIQUE INDEX "Achievement_code_key" ON "Achievement"("code");
CREATE INDEX "Achievement_category_idx" ON "Achievement"("category");
CREATE INDEX "Achievement_isActive_idx" ON "Achievement"("isActive");
CREATE INDEX "AchievementTranslation_language_idx" ON "AchievementTranslation"("language");
CREATE UNIQUE INDEX "AchievementTranslation_achievementId_language_key" ON "AchievementTranslation"("achievementId", "language");
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");
CREATE INDEX "Lesson_sectionId_idx" ON "Lesson"("sectionId");
CREATE INDEX "Lesson_contentId_idx" ON "Lesson"("contentId");
CREATE INDEX "Lesson_isPublished_idx" ON "Lesson"("isPublished");
CREATE INDEX "LessonTranslation_language_idx" ON "LessonTranslation"("language");
CREATE UNIQUE INDEX "LessonTranslation_lessonId_language_key" ON "LessonTranslation"("lessonId", "language");
CREATE INDEX "Testimonial_category_idx" ON "Testimonial"("category");
CREATE INDEX "Testimonial_isPublished_idx" ON "Testimonial"("isPublished");
CREATE INDEX "Testimonial_isFeatured_idx" ON "Testimonial"("isFeatured");
CREATE INDEX "Testimonial_displayOrder_idx" ON "Testimonial"("displayOrder");
CREATE INDEX "UserUnlock_userId_idx" ON "UserUnlock"("userId");
CREATE INDEX "UserUnlock_targetType_targetId_idx" ON "UserUnlock"("targetType", "targetId");
CREATE UNIQUE INDEX "UserUnlock_userId_targetType_targetId_key" ON "UserUnlock"("userId", "targetType", "targetId");
CREATE UNIQUE INDEX "Waitlist_email_key" ON "Waitlist"("email");
CREATE INDEX "Waitlist_email_idx" ON "Waitlist"("email");
CREATE INDEX "Waitlist_createdAt_idx" ON "Waitlist"("createdAt");
CREATE INDEX "AIUsageLog_userId_idx" ON "AIUsageLog"("userId");
CREATE INDEX "AIUsageLog_endpoint_idx" ON "AIUsageLog"("endpoint");
CREATE INDEX "AIUsageLog_modelId_idx" ON "AIUsageLog"("modelId");
CREATE INDEX "AIUsageLog_timestamp_idx" ON "AIUsageLog"("timestamp");
CREATE INDEX "AIUsageLog_userId_timestamp_idx" ON "AIUsageLog"("userId", "timestamp");
CREATE INDEX "AIUsageLog_endpoint_timestamp_idx" ON "AIUsageLog"("endpoint", "timestamp");
CREATE UNIQUE INDEX "StaticPage_slug_key" ON "StaticPage"("slug");
CREATE INDEX "StaticPage_slug_idx" ON "StaticPage"("slug");
CREATE INDEX "StaticPage_parentId_idx" ON "StaticPage"("parentId");
CREATE INDEX "StaticPage_isPublished_idx" ON "StaticPage"("isPublished");
CREATE INDEX "StaticPage_level_idx" ON "StaticPage"("level");
CREATE INDEX "StaticPage_order_idx" ON "StaticPage"("order");
CREATE INDEX "StaticPageTranslation_language_idx" ON "StaticPageTranslation"("language");
CREATE UNIQUE INDEX "StaticPageTranslation_pageId_language_key" ON "StaticPageTranslation"("pageId", "language");
CREATE INDEX "StaticPageComment_pageId_idx" ON "StaticPageComment"("pageId");
CREATE INDEX "StaticPageComment_userId_idx" ON "StaticPageComment"("userId");
CREATE INDEX "StaticPageComment_isApproved_idx" ON "StaticPageComment"("isApproved");
CREATE INDEX "StaticPageComment_parentId_idx" ON "StaticPageComment"("parentId");
CREATE UNIQUE INDEX "_ContentRelations_AB_unique" ON "_ContentRelations"("A", "B");
CREATE INDEX "_ContentRelations_B_index" ON "_ContentRelations"("B");
CREATE UNIQUE INDEX "_AnswerToUserAnswer_AB_unique" ON "_AnswerToUserAnswer"("A", "B");
CREATE INDEX "_AnswerToUserAnswer_B_index" ON "_AnswerToUserAnswer"("B");
CREATE INDEX "EmailCampaign_sentBy_idx" ON "EmailCampaign"("sentBy");
CREATE INDEX "EmailCampaign_sentAt_idx" ON "EmailCampaign"("sentAt");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_featured_idx" ON "Product"("featured");
CREATE INDEX "Product_slug_idx" ON "Product"("slug");
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");
CREATE UNIQUE INDEX "ProductVariant_productId_size_color_key" ON "ProductVariant"("productId", "size", "color");
CREATE INDEX "ProductImage_productId_position_idx" ON "ProductImage"("productId", "position");
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");
CREATE UNIQUE INDEX "CartItem_cartId_variantId_key" ON "CartItem"("cartId", "variantId");
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "ProductReview_productId_approved_idx" ON "ProductReview"("productId", "approved");
CREATE UNIQUE INDEX "ProductReview_productId_userId_key" ON "ProductReview"("productId", "userId");
CREATE UNIQUE INDEX "Discount_code_key" ON "Discount"("code");
CREATE INDEX "Discount_code_idx" ON "Discount"("code");
CREATE INDEX "Discount_validFrom_validUntil_idx" ON "Discount"("validFrom", "validUntil");
CREATE INDEX "Discount_active_idx" ON "Discount"("active");
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");
CREATE INDEX "Cart_sessionId_idx" ON "Cart"("sessionId");
CREATE INDEX "Cart_expiresAt_idx" ON "Cart"("expiresAt");
CREATE INDEX "Cart_reminderSent_idx" ON "Cart"("reminderSent");
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
CREATE INDEX "Setting_key_idx" ON "Setting"("key");
CREATE UNIQUE INDEX "Payment_providerPaymentId_key" ON "Payment"("providerPaymentId");
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX "Payment_courseId_idx" ON "Payment"("courseId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");
CREATE INDEX "Payment_provider_idx" ON "Payment"("provider");
CREATE INDEX "Payment_type_idx" ON "Payment"("type");
CREATE INDEX "Payment_userId_status_idx" ON "Payment"("userId", "status");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_targetUserId_idx" ON "AuditLog"("targetUserId");
CREATE INDEX "AuditLog_eventType_idx" ON "AuditLog"("eventType");
CREATE INDEX "AuditLog_severity_idx" ON "AuditLog"("severity");
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_result_idx" ON "AuditLog"("result");
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_userId_timestamp_idx" ON "AuditLog"("userId", "timestamp");
CREATE INDEX "AuditLog_eventType_timestamp_idx" ON "AuditLog"("eventType", "timestamp");
CREATE INDEX "AuditLog_severity_timestamp_idx" ON "AuditLog"("severity", "timestamp");
CREATE INDEX "AuditLog_action_result_idx" ON "AuditLog"("action", "result");
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");
CREATE INDEX "DailyActivity_userId_idx" ON "DailyActivity"("userId");
CREATE INDEX "DailyActivity_date_idx" ON "DailyActivity"("date");
CREATE UNIQUE INDEX "DailyActivity_userId_date_key" ON "DailyActivity"("userId", "date");
CREATE UNIQUE INDEX "Badge_code_key" ON "Badge"("code");
CREATE INDEX "Badge_category_idx" ON "Badge"("category");
CREATE INDEX "Badge_isActive_idx" ON "Badge"("isActive");
CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");
CREATE INDEX "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");
CREATE INDEX "Leaderboard_period_periodStart_idx" ON "Leaderboard"("period", "periodStart");
CREATE INDEX "Leaderboard_userId_idx" ON "Leaderboard"("userId");
CREATE INDEX "Leaderboard_rank_idx" ON "Leaderboard"("rank");
CREATE UNIQUE INDEX "Leaderboard_userId_period_periodStart_key" ON "Leaderboard"("userId", "period", "periodStart");
CREATE INDEX "Question_testId_idx" ON "Question"("testId");
CREATE INDEX "Test_contentId_idx" ON "Test"("contentId");
CREATE INDEX "Test_lessonId_idx" ON "Test"("lessonId");
CREATE UNIQUE INDEX "PSKPProfile_testResultId_key" ON "PSKPProfile"("testResultId");
COMMIT;
