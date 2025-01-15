import {
  PrismaClient,
  Role,
  SpecialtyType,
  SubscriptionDuration,
  SubscriptionLevel,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await cleanDatabase();
  await seedManager();
  const subscriptions = await seedSubscriptions();
  const specialties = await seedSpecialties();
  const trainers = await seedTrainers(specialties);
  const classes = await seedClasses(trainers);
  const nutritionists = await seedNutritionists(specialties);
  const nutritionPlans = await seedNutritionPlans(nutritionists);
  const customers = await seedCustomers();
  await seedCustomerSubscriptions(customers, subscriptions);
  await seedClassEnrollments(customers, classes);
  await seedPlanEnrollments(customers, nutritionPlans);
  console.log('تم إدخال البيانات بنجاح!');
}

async function cleanDatabase() {
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);

  const tables = [
    'CustomerClass',
    'CustomerNutritionPlan',
    'CustomerSubscription',
    'Class',
    'Customer',
    'NutritionPlan',
    'Nutritionist',
    'Subscription',
    'Trainer',
    'Specialty',
    'User',
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\`;`);
  }

  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
}

async function seedManager() {
  const managerUser = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@email.com',
      password: await bcrypt.hash('manager123', 10),
      role: Role.MANAGER,
    },
  });
  console.log('Manager user created:', managerUser);
}
async function seedSubscriptions() {
  const subscriptions = [
    {
      level: SubscriptionLevel.BASIC,
      duration: SubscriptionDuration.MONTHLY,
      cost: 199.0,
    },
    {
      level: SubscriptionLevel.BASIC,
      duration: SubscriptionDuration.QUARTERLY,
      cost: 499.0,
    },
    {
      level: SubscriptionLevel.VIP,
      duration: SubscriptionDuration.MONTHLY,
      cost: 399.0,
    },
    {
      level: SubscriptionLevel.VIP,
      duration: SubscriptionDuration.QUARTERLY,
      cost: 999.0,
    },
    {
      level: SubscriptionLevel.PREMIUM,
      duration: SubscriptionDuration.QUARTERLY,
      cost: 1499.0,
    },
    {
      level: SubscriptionLevel.PREMIUM,
      duration: SubscriptionDuration.ANNUAL,
      cost: 4999.0,
    },
  ];

  return Promise.all(
    subscriptions.map((sub) => prisma.subscription.create({ data: sub })),
  );
}

async function seedSpecialties() {
  const specialties = [
    // تخصصات المدربين
    { name: 'يوجا وتأمل', target: SpecialtyType.TRAINER },
    { name: 'تدريب القوة والأثقال', target: SpecialtyType.TRAINER },
    { name: 'اللياقة البدنية الشاملة', target: SpecialtyType.TRAINER },
    { name: 'تمارين كارديو متقدمة', target: SpecialtyType.TRAINER },
    { name: 'كروس فيت', target: SpecialtyType.TRAINER },
    { name: 'تدريب رياضي شخصي', target: SpecialtyType.TRAINER },
    { name: 'تدريب المرونة والتوازن', target: SpecialtyType.TRAINER },
    { name: 'تدريب المبتدئين', target: SpecialtyType.TRAINER },
    { name: 'تدريب كبار السن', target: SpecialtyType.TRAINER },
    { name: 'تدريب ما بعد الإصابات', target: SpecialtyType.TRAINER },
    // تخصصات التغذية
    { name: 'تغذية رياضيي القوة', target: SpecialtyType.NUTRITIONIST },
    { name: 'تغذية رياضيي التحمل', target: SpecialtyType.NUTRITIONIST },
    { name: 'إدارة الوزن والسمنة', target: SpecialtyType.NUTRITIONIST },
    { name: 'تغذية علاجية', target: SpecialtyType.NUTRITIONIST },
    { name: 'تغذية نباتية', target: SpecialtyType.NUTRITIONIST },
    { name: 'تغذية مرضى السكري', target: SpecialtyType.NUTRITIONIST },
    { name: 'تغذية ما بعد العمليات', target: SpecialtyType.NUTRITIONIST },
    { name: 'تغذية الحوامل والمرضعات', target: SpecialtyType.NUTRITIONIST },
  ];

  return Promise.all(
    specialties.map((specialty) =>
      prisma.specialty.create({ data: specialty }),
    ),
  );
}

async function seedTrainers(specialties) {
  const trainers = [
    {
      name: 'أحمد محمد الهاشمي',
      email: 'ahmed.h@gym.com',
      specialtyName: 'يوجا وتأمل',
    },
    {
      name: 'عمر خالد السعيد',
      email: 'omar.s@gym.com',
      specialtyName: 'تدريب القوة والأثقال',
    },
    {
      name: 'ياسر علي العمري',
      email: 'yasser.a@gym.com',
      specialtyName: 'اللياقة البدنية الشاملة',
    },
    {
      name: 'محمد سعيد النجار',
      email: 'mohamed.n@gym.com',
      specialtyName: 'تمارين كارديو متقدمة',
    },
    {
      name: 'خالد عمر الصباحي',
      email: 'khaled.s@gym.com',
      specialtyName: 'كروس فيت',
    },
    {
      name: 'طارق حسن المالكي',
      email: 'tarek.m@gym.com',
      specialtyName: 'تدريب رياضي شخصي',
    },
    {
      name: 'سعد محمود الشمري',
      email: 'saad.sh@gym.com',
      specialtyName: 'تدريب المرونة والتوازن',
    },
    {
      name: 'فيصل عبدالله القحطاني',
      email: 'faisal.q@gym.com',
      specialtyName: 'تدريب المبتدئين',
    },
    {
      name: 'بندر سلطان العتيبي',
      email: 'bandar.o@gym.com',
      specialtyName: 'تدريب كبار السن',
    },
    {
      name: 'ماجد فهد الدوسري',
      email: 'majed.d@gym.com',
      specialtyName: 'تدريب ما بعد الإصابات',
    },
    // Add more trainers with full names
  ];

  return Promise.all(
    trainers.map(async (trainer) => {
      const user = await prisma.user.create({
        data: {
          name: trainer.name,
          email: trainer.email,
          password: await bcrypt.hash('trainer123', 10),
          role: Role.TRAINER,
          phone: generateRandomPhone(),
        },
      });

      const specialty = specialties.find(
        (s) => s.name === trainer.specialtyName,
      );
      return prisma.trainer.create({
        data: {
          user: { connect: { id: user.id } },
          specialty: { connect: { id: specialty.id } },
        },
      });
    }),
  );
}

async function seedClasses(trainers) {
  const classTemplates = [
    {
      name: 'يوجا للاسترخاء والتأمل',
      maxCapacity: 20,
      scheduleTemplate: [
        { day: 'الاثنين', time: '08:00' },
        { day: 'الأربعاء', time: '08:00' },
        { day: 'السبت', time: '09:00' },
      ],
    },
    {
      name: 'تمارين القوة المتقدمة',
      maxCapacity: 12,
      scheduleTemplate: [
        { day: 'الاثنين', time: '17:00' },
        { day: 'الأربعاء', time: '17:00' },
        { day: 'الجمعة', time: '16:00' },
      ],
    },
    {
      name: 'لياقة بدنية للمبتدئين',
      maxCapacity: 15,
      scheduleTemplate: [
        { day: 'الثلاثاء', time: '09:00' },
        { day: 'الخميس', time: '09:00' },
        { day: 'السبت', time: '10:00' },
      ],
    },
    {
      name: 'تمارين حرق الدهون المكثفة',
      maxCapacity: 20,
      scheduleTemplate: [
        { day: 'الاثنين', time: '19:00' },
        { day: 'الأربعاء', time: '19:00' },
        { day: 'الجمعة', time: '18:00' },
      ],
    },
    {
      name: 'كروس فت للمتقدمين',
      maxCapacity: 15,
      scheduleTemplate: [
        { day: 'الثلاثاء', time: '18:00' },
        { day: 'الخميس', time: '18:00' },
        { day: 'السبت', time: '17:00' },
      ],
    },
    {
      name: 'تمارين المرونة والإطالة',
      maxCapacity: 25,
      scheduleTemplate: [
        { day: 'الأحد', time: '10:00' },
        { day: 'الثلاثاء', time: '10:00' },
        { day: 'الخميس', time: '10:00' },
      ],
    },
    // Add more class templates
  ];

  const classes = [];
  for (const trainer of trainers) {
    // Assign 2-3 random classes to each trainer
    const numClasses = Math.floor(Math.random() * 2) + 2;
    const trainerClasses = shuffleArray(classTemplates).slice(0, numClasses);

    for (const template of trainerClasses) {
      classes.push({
        name: template.name,
        schedule: template.scheduleTemplate,
        maxCapacity: template.maxCapacity,
        trainerId: trainer.id,
      });
    }
  }

  return Promise.all(classes.map((cls) => prisma.class.create({ data: cls })));
}

async function seedNutritionists(specialties) {
  const nutritionists = [
    {
      name: 'سارة أحمد الغامدي',
      email: 'sara.g@gym.com',
      specialtyName: 'تغذية رياضيي القوة',
    },
    {
      name: 'ريم محمد الزهراني',
      email: 'reem.z@gym.com',
      specialtyName: 'إدارة الوزن والسمنة',
    },
    {
      name: 'نور علي البلوي',
      email: 'nour.b@gym.com',
      specialtyName: 'تغذية علاجية',
    },
    {
      name: 'منى حسن العمري',
      email: 'mona.o@gym.com',
      specialtyName: 'تغذية نباتية',
    },
    {
      name: 'لينا سعيد القرني',
      email: 'lina.q@gym.com',
      specialtyName: 'تغذية مرضى السكري',
    },
    {
      name: 'دانة فهد السبيعي',
      email: 'dana.s@gym.com',
      specialtyName: 'تغذية رياضيي التحمل',
    },
    {
      name: 'عبير خالد المطيري',
      email: 'abeer.m@gym.com',
      specialtyName: 'تغذية ما بعد العمليات',
    },
    {
      name: 'هند سلطان الشهري',
      email: 'hind.sh@gym.com',
      specialtyName: 'تغذية الحوامل والمرضعات',
    },
    // Add more nutritionists
  ];

  return Promise.all(
    nutritionists.map(async (nutritionist) => {
      const user = await prisma.user.create({
        data: {
          name: nutritionist.name,
          email: nutritionist.email,
          password: await bcrypt.hash('nutrition123', 10),
          role: Role.NUTRITIONIST,
          phone: generateRandomPhone(),
        },
      });

      const specialty = specialties.find(
        (s) => s.name === nutritionist.specialtyName,
      );
      return prisma.nutritionist.create({
        data: {
          user: { connect: { id: user.id } },
          specialty: { connect: { id: specialty.id } },
        },
      });
    }),
  );
}
async function seedNutritionPlans(nutritionists) {
  const planTemplates = [
    {
      title: 'برنامج خسارة الوزن الصحي',
      planDetails: `هذه الخطة الغذائية تهدف إلى خسارة الوزن بشكل صحي وآمن من خلال اتباع نظام غذائي متوازن غني بالبروتينات والألياف مع تنظيم أوقات الوجبات. إليك التفاصيل التي يمكنك اتباعها:

    **وجبات متوازنة غنية بالبروتين والألياف:**
    - **الإفطار:**  
      - شريحة من التوست الأسمر مع بيضة مسلوقة أو أومليت بزيت الزيتون.  
      - كوب من اللبن قليل الدسم أو لبن نباتي مدعم.  
      - شرائح من الخضروات مثل الخيار، الطماطم، والجزر.

    - **الغداء:**  
      - تناول 120-150 غرامًا من البروتين مثل الدجاج المشوي أو السمك أو اللحم الخالي من الدهون، أو يمكن اختيار بروتين نباتي مثل التوفو.  
      - كوب من الأرز البني أو الكينوا أو شريحة من الخبز كامل الحبوب.  
      - طبق سلطة كبير يحتوي على خضروات متنوعة مع عصير الليمون وزيت الزيتون.

    - **العشاء:**  
      - نصف كوب من الزبادي قليل الدسم مع حفنة صغيرة من المكسرات النيئة.  
      - شريحة من التوست مع ملعقة صغيرة من زبدة اللوز أو الفول السوداني الطبيعية.  
      - شرائح من الخضروات مثل الكرفس أو الفلفل الملون.

    - **وجبات خفيفة (سناك):**  
      - حفنة من الفواكه المجففة غير المحلاة أو الفواكه الطازجة مثل التفاح أو البرتقال.  
      - حفنة من المكسرات النيئة أو بذور الشيا.  
      - كوب من الفشار المعد في الهواء بدون زبدة.

    **تنظيم أوقات الوجبات بين 4-6 ساعات:**
    - تناول الوجبة الأولى خلال ساعة من الاستيقاظ.
    - تناول وجبة خفيفة بين الوجبات الرئيسية لتجنب الشعور بالجوع الشديد.
    - الالتزام بوجبة العشاء قبل النوم بساعتين على الأقل.

    **نصائح لتحضير وجبات خفيفة صحية:**
    - قم بإعداد الفواكه والخضروات المقطعة مسبقًا لتسهيل تناول السناك الصحي.
    - تحضير الحساء أو السلطات الخفيفة في بداية الأسبوع لتكون جاهزة وقت الحاجة.
    - اختر بدائل صحية مثل استبدال الشوكولاتة الداكنة بالحلوى المصنعة واستبدال العصائر السكرية بالمياه المضاف إليها شرائح الليمون أو النعناع.

    **تجنب السكريات المصنعة والمشروبات الغازية:**
    - قلل من السكر المضاف في الشاي والقهوة تدريجيًا.
    - استخدم المحليات الطبيعية مثل العسل بكميات معتدلة.
    - اقرأ الملصقات الغذائية وتجنب المنتجات التي تحتوي على سكريات مخفية.

    **خطة تدريجية لتغيير العادات الغذائية السيئة:**
    - **الأسبوع الأول:** استبدل وجبة غير صحية بوجبة صحية يوميًا وزيّن شرب الماء بحيث تصل إلى 8 أكواب يوميًا.
    - **الأسبوع الثاني:** قلل من تناول الأطعمة السريعة إلى مرة واحدة أسبوعيًا فقط، وزيّن الوجبات بإضافة 1-2 حصة من الخضروات والفواكه يوميًا.
    - **الأسبوع الثالث:** استبدل المشروبات السكرية بالماء أو الشاي الأخضر وكن حريصًا على تناول الطعام ببطء ومضغه جيدًا.
    - **الأسبوع الرابع:** خطط وجباتك مسبقًا لتجنب العشوائية وابدأ في ممارسة الرياضة الخفيفة لمدة 20 دقيقة يوميًا مثل المشي أو اليوغا.

    **إضافات لتعزيز الالتزام بالخطة:**
    - احرص على الاحتفاظ بمفكرة غذائية لتسجيل الطعام المتناول.
    - كافئ نفسك أسبوعيًا بوجبة صحية مفضلة أو نشاط ممتع.
    - قم بقياس التقدم بشكل منتظم دون التركيز فقط على الوزن، مثل قياس محيط الخصر أو ملاحظة مستوى النشاط والطاقة.
    `,
    },
    {
      title: 'برنامج تغذية رياضيي القوة',
      planDetails: `خطة غذائية خاصة لرياضيي القوة والأثقال تركز على تزويد الجسم بالعناصر اللازمة لبناء العضلات وتحقيق الأداء الأمثل:

    **توزيع مثالي للماكروز:**  
    يجب أن يحتوي النظام الغذائي على نسبة عالية من البروتين لتساعد في بناء العضلات، مع احتوائه على كميات كافية من الكربوهيدرات لتوفير الطاقة والدهون الصحية.  
    - البروتين: 1.6-2.2 جرام لكل كيلوغرام من وزن الجسم.
    - الكربوهيدرات: 4-6 جرامات لكل كيلوغرام من وزن الجسم.
    - الدهون: 1-1.5 جرام لكل كيلوغرام من وزن الجسم.

    **وجبات ما قبل وبعد التمرين:**  
    - قبل التمرين: تناول وجبة تحتوي على البروتين والكربوهيدرات (مثل الأرز مع الدجاج أو السمك مع البطاطس).
    - بعد التمرين: تناول وجبة تحتوي على البروتين بسرعة الامتصاص (مثل مكملات البروتين أو زبادي قليل الدسم مع فواكه).

    **مكملات غذائية موصى بها:**  
    - بروتين مصل اللبن (Whey Protein) لتعزيز بناء العضلات بعد التمرين.
    - كرياتين لتحسين الأداء أثناء التمرين وزيادة القوة.
    - أوميغا 3 لتحسين صحة القلب والحد من الالتهابات.

    **خطة زيادة الوزن العضلي:**  
    - تناول 300-500 سعرة حرارية إضافية يوميًا لتحقيق زيادة الوزن العضلي.
    - التركيز على تناول البروتينات في كل وجبة لتعزيز نمو العضلات.
    - زيادة كمية الكربوهيدرات لتحسين الطاقة وتحقيق التمارين الشاقة.

    **نصائح لتحسين الأداء الرياضي:**  
    - حافظ على راحة كافية بين التمارين.
    - تأكد من أنك تتناول الأطعمة الصحية قبل وأثناء وبعد التمرين.
    - حافظ على ترطيب جيد للجسم بشرب كميات كافية من الماء.

    `,
    },
    {
      title: 'برنامج تغذية صحي متوازن',
      planDetails: `خطة غذائية متوازنة تهدف إلى الحفاظ على الصحة العامة والتوازن الغذائي:

    **وجبات صحية متكاملة:**  
    - تأكد من أن كل وجبة تحتوي على مزيج من البروتينات، الكربوهيدرات، والدهون الصحية.
    - تناول الخضروات والفواكه بكثرة لزيادة الألياف والفيتامينات والمعادن.
    - الابتعاد عن الأطعمة المصنعة والوجبات السريعة.

    **مصادر الفيتامينات والمعادن:**  
    - تناول الأطعمة الغنية بفيتامين C مثل البرتقال والفواكه الحمضية.
    - تناول الأطعمة الغنية بالكالسيوم مثل الحليب أو البدائل النباتية.
    - الأطعمة الغنية بالحديد مثل اللحوم الحمراء والسبانخ.

    **إرشادات التسوق الصحي:**  
    - اختر الأطعمة الطازجة والموسمية.
    - تجنب الأطعمة المعلبة والجاهزة.
    - اقرأ المكونات والملصقات الغذائية قبل شراء أي منتج.

    **أفكار لوجبات خفيفة صحية:**  
    - تناول الفواكه الطازجة أو المكسرات النيئة كوجبات خفيفة.
    - يمكن تحضير الزبادي اليوناني مع المكسرات والعسل.
    - شريحة من التوست مع زبدة اللوز أو الأفوكادو.

    **نصائح للمناسبات الاجتماعية:**  
    - عند تناول الطعام خارج المنزل، اختر الخيارات الصحية مثل السلطات أو البروتين المشوي.
    - تجنب تناول الأطعمة الثقيلة والدهنية وابتعد عن المشروبات السكرية.
    `,
    },
    {
      title: 'برنامج التغذية العلاجية',
      planDetails: `خطة غذائية علاجية مصممة خصيصًا للحالات الصحية الخاصة مثل الأمراض المزمنة أو الحالات التي تتطلب تعديل النظام الغذائي:

    **وجبات مخصصة للحالة الصحية:**  
    - تناول الأطعمة المسموحة فقط وفقًا لتوجيهات الطبيب.
    - استبدل الأطعمة الممنوعة بأطعمة صحية مشابهة.
    - التأكد من وجود توازن غذائي في كل وجبة لتلبية احتياجات الجسم.

    **تنظيم مواعيد الوجبات:**  
    - تنظيم الوجبات بحيث لا تتسبب في زيادة الأعراض أو التأثير على الحالة الصحية.
    - تحديد مواعيد ثابتة للوجبات لتجنب التغيرات المفاجئة في مستويات السكر أو الطاقة.

    **قائمة الأطعمة المسموحة والممنوعة:**  
    - ابتعد عن الأطعمة المقلية أو المصنعة.
    - تناول البروتينات الخفيفة مثل الدجاج المشوي أو السمك.
    - ركز على تناول الخضروات الطازجة والفواكه منخفضة السكر.

    **بدائل غذائية صحية:**  
    - استبدل السكريات المصنعة بالعسل أو الفواكه.
    - استبدل الأطعمة المقلية بالأطعمة المشوية أو المطهوة على البخار.
    
    **إرشادات لتجنب المضاعفات:**  
    - تأكد من اتباع تعليمات الطبيب حول النظام الغذائي.
    - مراقبة مستويات السكر والضغط بشكل دوري.

    `,
    },
    {
      title: 'برنامج تغذية الرياضيين المتقدم',
      planDetails: `خطة غذائية متقدمة تهدف إلى تزويد الرياضيين المحترفين بالعناصر الضرورية لتحقيق الأداء الأمثل:

    **برنامج تغذية مرحلي:**  
    - اتبع خطة غذائية تتناسب مع أهدافك الرياضية مثل زيادة القوة أو التحمل.
    - تأكد من تغيير النظام الغذائي حسب احتياجات التدريب والمنافسات.

    **تخطيط الوجبات حسب جدول التدريب:**  
    - تناول الوجبات بناءً على توقيت التمرين لتعزيز الأداء.
    - تأكد من تناول الوجبة المناسبة قبل وبعد التمرين مباشرة لتعزيز التعافي.

    **توقيت المكملات الغذائية:**  
    - تناول المكملات مثل البروتين والفيتامينات في الأوقات المحددة لتعزيز الأداء.
    - استخدم المكملات بعد التمرين لتحفيز بناء العضلات.

    **خطة تغذية المنافسات:**  
    - تناول الوجبات التي توفر لك الطاقة المطلوبة قبل المنافسات.
    - تجنب الوجبات الثقيلة أو المقلية قبل يوم من المنافسة.

    **استراتيجيات التعافي الغذائي:**  
    - تناول وجبة تحتوي على البروتين والكربوهيدرات بعد التمرين لتحفيز التعافي.
    - احرص على الراحة الجيدة والترطيب بعد التمرين لتحسين الأداء المستقبلي.
    `,
    },
  ];

  const plans = [];
  for (const nutritionist of nutritionists) {
    // Add variations for each template based on nutritionist specialty
    for (const template of planTemplates) {
      plans.push({
        title: `${template.title} `,
        planDetails: template.planDetails,
        nutritionistId: nutritionist.id,
      });
    }
  }

  return Promise.all(
    plans.map((plan) => prisma.nutritionPlan.create({ data: plan })),
  );
}

async function seedCustomers() {
  // قائمة بالأسماء العربية الشائعة
  const firstNames = [
    'محمد',
    'أحمد',
    'عبدالله',
    'خالد',
    'عمر',
    'سعد',
    'فهد',
    'إبراهيم',
    'عبدالرحمن',
    'سلطان',
    'نورة',
    'سارة',
    'ريم',
    'منى',
    'هند',
    'لينا',
    'دانة',
    'عبير',
    'رنا',
    'أمل',
  ];

  const lastNames = [
    'الهاشمي',
    'السعيد',
    'العمري',
    'النجار',
    'الصباحي',
    'المالكي',
    'الشمري',
    'القحطاني',
    'العتيبي',
    'الغامدي',
    'الزهراني',
    'البلوي',
    'العمري',
    'القرني',
    'السبيعي',
    'المطيري',
    'الشهري',
    'الدوسري',
  ];

  const customers = [];
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    customers.push({
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@example.com`,
      phone: generateRandomPhone(),
    });
  }

  return Promise.all(
    customers.map(async (customer) => {
      const user = await prisma.user.create({
        data: {
          name: customer.name,
          email: customer.email,
          password: await bcrypt.hash('customer123', 10),
          role: Role.CUSTOMER,
          phone: customer.phone,
        },
      });

      return prisma.customer.create({
        data: {
          user: { connect: { id: user.id } },
        },
      });
    }),
  );
}

function generateRandomPhone() {
  // Generate Saudi phone number format
  const prefixes = ['050', '054', '055', '056', '058', '059'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix}${number}`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function seedCustomerSubscriptions(customers, subscriptions) {
  const currentDate = new Date();
  const customerSubs = customers.map((customer) => {
    const subscription =
      subscriptions[Math.floor(Math.random() * subscriptions.length)];
    const startDate = new Date(currentDate);
    const endDate = new Date(startDate);

    // Add months based on subscription duration
    switch (subscription.duration) {
      case SubscriptionDuration.MONTHLY:
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case SubscriptionDuration.QUARTERLY:
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case SubscriptionDuration.ANNUAL:
        endDate.setMonth(endDate.getMonth() + 12);
        break;
    }

    return {
      customerId: customer.id,
      subscriptionId: subscription.id,
      startDate,
      endDate,
    };
  });

  return Promise.all(
    customerSubs.map((sub) =>
      prisma.customerSubscription.create({ data: sub }),
    ),
  );
}

async function seedClassEnrollments(customers, classes) {
  const enrollments = [];
  for (const customer of customers) {
    // Enroll each customer in 1-3 random classes
    const numEnrollments = Math.floor(Math.random() * 3) + 1;
    const selectedClasses = shuffleArray([...classes]).slice(0, numEnrollments);

    for (const cls of selectedClasses) {
      enrollments.push({
        customerId: customer.id,
        classId: cls.id,
      });
    }
  }

  return Promise.all(
    enrollments.map((enrollment) =>
      prisma.customerClass.create({ data: enrollment }),
    ),
  );
}

async function seedPlanEnrollments(customers, plans) {
  const enrollments = [];
  for (const customer of customers) {
    // Enroll each customer in 1-2 random plans
    const numEnrollments = Math.floor(Math.random() * 2) + 1;
    const selectedPlans = shuffleArray([...plans]).slice(0, numEnrollments);

    for (const plan of selectedPlans) {
      enrollments.push({
        customerId: customer.id,
        planId: plan.id,
      });
    }
  }

  return Promise.all(
    enrollments.map((enrollment) =>
      prisma.customerNutritionPlan.create({ data: enrollment }),
    ),
  );
}

main()
  .catch((error) => {
    console.error('خطأ في إدخال البيانات:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
