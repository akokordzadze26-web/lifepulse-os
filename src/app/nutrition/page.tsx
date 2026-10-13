"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const translations: Record<string, any> = {
  en: {
    back: "← Back to Home",
    title: "Nutrition & Smart Meal Generator",
    goalLabel: "🎯 Select Your Goal:",
    goalLoss: "Weight Loss",
    goalGain: "Weight Gain",
    goalMaintain: "Weight Maintenance",
    calcTitle: "🧮 Calorie & BMR Calculator",
    weight: "Weight (kg)",
    height: "Height (cm)",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    activity: "Activity Level",
    sedentary: "Sedentary (little exercise)",
    light: "Light (1-3 days/week)",
    moderate: "Moderate (3-5 days/week)",
    active: "Active (6-7 days/week)",
    calculate: "Calculate Target & Generate Meals",
    targetResult: "Your Daily Calorie Target:",
    recipeTitle: "🍳 Custom Meals Scaled to Your Target Calories",
    viewRecipe: "📖 View Recipe & Exact Grams",
    closeModal: "✕ Close",
    ingredients: "⚖️ Ingredients & Scaled Grams:",
    instructions: "👨‍🍳 Cooking Instructions:",
    mealName: "Meal Name",
    calories: "Calories (kcal)",
    addMeal: "➕ Add Custom Meal",
    dailyLog: "🥗 Today's Nutrition Log",
    totalCalories: "Total Calories",
    noMeals: "No meals logged yet.",
    delete: "Delete",
    categories: {
      breakfast: "🌅 Breakfast",
      lunch: "☀️ Lunch",
      dinner: "🌙 Dinner",
      snack: "🍏 Snack / Protein Booster"
    }
  },
  ka: {
    back: "← მთავარზე დაბრუნება",
    title: "კვება & პერსონალური კერძების გენერატორი",
    goalLabel: "🎯 აირჩიე შენი მიზანი:",
    goalLoss: "წონის კლება",
    goalGain: "წონის მომატება",
    goalMaintain: "წონის შენარჩუნება",
    calcTitle: "🧮 კალორიების & BMR კალკულატორი",
    weight: "წონა (კგ)",
    height: "სიმაღლე (სმ)",
    age: "ასაკი",
    gender: "სქესი",
    male: "მამრობითი",
    female: "მდედრობითი",
    activity: "აქტივობის დონე",
    sedentary: "დაბალი (მჯდომარე ცხოვრება)",
    light: "მსუბუქი (ვარჯიში 1-3-ჯერ)",
    moderate: "ზომიერი (ვარჯიში 3-5-ჯერ)",
    active: "აქტიური (ვარჯიში 6-7-ჯერ)",
    calculate: "ნორმის გამოთვლა & კერძების მოარგება",
    targetResult: "შენი დღიური კალორიული ნორმა:",
    recipeTitle: "🍳 შენს კალორიებზე მორგებული პერსონალური კერძები",
    viewRecipe: "📖 ინსტრუქცია & ზუსტი გრამაჟი",
    closeModal: "✕ დახურვა",
    ingredients: "⚖️ ინგრედიენტები და გადათვლილი გრამაჟები:",
    instructions: "👨‍🍳 მომზადების წესი:",
    mealName: "კვების დასახელება",
    calories: "კალორიები (კკალ)",
    addMeal: "➕ კვების დამატება",
    dailyLog: "🥗 დღიური კვების ჟურნალი",
    totalCalories: "ჯამური კალორიები",
    noMeals: "კვებები ჯერ არ არის დამატებული.",
    delete: "წაშლა",
    categories: {
      breakfast: "🌅 საუზმე",
      lunch: "☀️ სადილი",
      dinner: "🌙 ვახშამი",
      snack: "🍏 წასახემსებელი / პროტეინი"
    }
  },
  ru: {
    back: "← На главную",
    title: "Питание и генератор персональных блюд",
    goalLabel: "🎯 Выберите вашу цель:",
    goalLoss: "Похудение",
    goalGain: "Набор веса",
    goalMaintain: "Поддержание веса",
    calcTitle: "🧮 Калькулятор калорий и BMR",
    weight: "Вес (кг)",
    height: "Рост (см)",
    age: "Возраст",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    activity: "Уровень активности",
    sedentary: "Минимальная активность",
    light: "Лёгкая (1-3 раз в неделю)",
    moderate: "Умеренная (3-5 раз в неделю)",
    active: "Активная (6-7 раз в неделю)",
    calculate: "Рассчитать и подобрать блюда",
    targetResult: "Ваша суточная норма калорий:",
    recipeTitle: "🍳 Персональные блюда, рассчитанные под вашу норму",
    viewRecipe: "📖 Рецепт и точные граммы",
    closeModal: "✕ Закрыть",
    ingredients: "⚖️ Ингредиенты и пересчитанные граммы:",
    instructions: "👨‍🍳 Способ приготовления:",
    mealName: "Название блюда",
    calories: "Калории (ккал)",
    addMeal: "➕ Добавить прием пищи",
    dailyLog: "🥗 Дневной журнал питания",
    totalCalories: "Всего калорий",
    noMeals: "Приемы пищи пока не добавлены.",
    delete: "Удалить",
    categories: {
      breakfast: "🌅 Завтрак",
      lunch: "☀️ Обед",
      dinner: "🌙 Ужин",
      snack: "🍏 Перекус / Протеин"
    }
  },
};

// Base Meals Database
const baseMealsDb = [
  // LOSS
  {
    goal: "loss",
    cat: "breakfast",
    name: { en: "Protein Oatmeal & Berries", ka: "ცილოვანი შვრიის ფაფა კენკრით", ru: "Протеиновая овсянка с ягодами" },
    baseCals: 320,
    baseGrams: { en: "Oats: {oats}g | Whey Protein: {prot}g | Berries: {berry}g | Almonds: {almond}g", ka: "შვრია: {oats}გ | პროტეინი: {prot}გ | კენკრა: {berry}გ | ნუში: {almond}გ", ru: "Овсянка: {oats}г | Протеин: {prot}г | Ягоды: {berry}г | Миндаль: {almond}г" },
    steps: { en: "1. Cook oats in water.\n2. Stir in protein powder, top with berries and almonds.", ka: "1. მოხარშეთ შვრია წყალში.\n2. შეურიეთ პროტეინის ფხვნილი, მოაყარეთ კენკრა და ნუში.", ru: "1. Сварить овсянку на воде.\n2. Вмешать протеин, украсить ягодами и миндалем." }
  },
  {
    goal: "loss",
    cat: "lunch",
    name: { en: "Grilled Turkey & Steamed Broccoli", ka: "ინდაურის სტეიკი და ბროკოლი", ru: "Стейк из индейки с брокколи" },
    baseCals: 420,
    baseGrams: { en: "Turkey Fillet: {turkey}g | Broccoli: {broc}g | Olive Oil: {oil}ml", ka: "ინდაურის ფილე: {turkey}გ | ბროკოლი: {broc}გ | ზეითუნის ზეთი: {oil}მლ", ru: "Филе индейки: {turkey}г | Брокколи: {broc}г | Оливковое масло: {oil}мл" },
    steps: { en: "1. Season turkey with herbs and grill.\n2. Steam broccoli until bright green.", ka: "1. შეაზავეთ ინდაური სანელებლებით და შეწვით გრილზე.\n2. მოხარშეთ ბროკოლი ორთქლზე.", ru: "1. Обжарить филе индейки на гриле.\n2. Приготовить брокколи на пару." }
  },
  {
    goal: "loss",
    cat: "dinner",
    name: { en: "Baked Salmon & Fresh Salad", ka: "გამომცხვარი ორაგული და სალათი", ru: "Запеченный лосось со свежим салатом" },
    baseCals: 450,
    baseGrams: { en: "Salmon Fillet: {salmon}g | Greens & Cucumber: {greens}g | Lemon Juice: 15ml", ka: "ორაგულის ფილე: {salmon}გ | მწვანე სალათი და კიტრი: {greens}გ | ლიმონი: 15მლ", ru: "Филе лосося: {salmon}г | Зелень и огурец: {greens}г | Лимон: 15мл" },
    steps: { en: "1. Bake salmon at 190°C for 15 mins.\n2. Toss salad with lemon juice and herbs.", ka: "1. გამოაცხვეთ ორაგული 190°C-ზე 15 წუთით.\n2. შეურიეთ სალათი ლიმონის წვენით.", ru: "1. Запечь лосось при 190°C 15 минут.\n2. Заправить салат лимонным соком." }
  },
  {
    goal: "loss",
    cat: "snack",
    name: { en: "Greek Yogurt & Chia Seeds", ka: "ბერძნული იოგურტი ჩიას თესლით", ru: "Греческий йогурт с семенами чиа" },
    baseCals: 210,
    baseGrams: { en: "0% Greek Yogurt: {yogurt}g | Chia Seeds: {chia}g", ka: "0% ბერძნული იოგურტი: {yogurt}გ | ჩიას თესლი: {chia}გ", ru: "0% Греческий йогурт: {yogurt}г | Семена чиа: {chia}г" },
    steps: { en: "1. Mix chia seeds into cold yogurt and let sit for 10 mins.", ka: "1. შეურიეთ ჩიას თესლი ცივ იოგურტში და გააჩერეთ 10 წუთი.", ru: "1. Смешать семена чиа с йогуртом и дать настояться 10 минут." }
  },

  // GAIN
  {
    goal: "gain",
    cat: "breakfast",
    name: { en: "High-Calorie Peanut Butter & Oats Shake", ka: "მაღალკალორიული არაქისის სმუზი", ru: "Высококалорийный смузи с арахисовой пастой" },
    baseCals: 720,
    baseGrams: { en: "Oats: {oats}g | Whole Milk: {milk}ml | Peanut Butter: {pb}g | Banana: 2 pcs", ka: "შვრია: {oats}გ | რძე: {milk}მლ | არაქისის კარაქი: {pb}გ | ბანანი: 2 ცალი", ru: "Овсянка: {oats}г | Молоко: {milk}мл | Арахисовая паста: {pb}г | Банан: 2 шт" },
    steps: { en: "1. Blend oats, milk, bananas, and peanut butter until smooth.", ka: "1. ათქვიფეთ ყველა ინგრედიენტი ბლენდერში ერთგვაროვან მასამდე.", ru: "1. Взбить все ингредиенты в блендере до однородности." }
  },
  {
    goal: "gain",
    cat: "lunch",
    name: { en: "Ribeye Steak with Rice & Avocado", ka: "რიბაი სტეიკი ბრინჯითა და ავოკადოთი", ru: "Стейк Рибай с рисом и авокадо" },
    baseCals: 850,
    baseGrams: { en: "Beef Steak: {steak}g | Cooked White Rice: {rice}g | Avocado: {avo}g", ka: "ძროხის სტეიკი: {steak}გ | მოხარშული ბრინჯი: {rice}გ | ავოკადო: {avo}გ", ru: "Стейк из говядины: {steak}г | Вареный рис: {rice}г | Авокадо: {avo}г" },
    steps: { en: "1. Sear beef steak in butter.\n2. Serve with cooked rice and avocado slices.", ka: "1. შეწვით სტეიკი ერბოში ან კარაქში.\n2. მიირთვით ცხელ ბრინჯთან და ავოკადოსთან ერთად.", ru: "1. Обжарить стейк на сливочном масле.\n2. Подавать с рисом и авокадо." }
  },
  {
    goal: "gain",
    cat: "dinner",
    name: { en: "Cheesy Pasta with Minced Beef", ka: "ყველიანი მაკარონი ძროხის ფარშით", ru: "Макароны с сыром и фаршем" },
    baseCals: 780,
    baseGrams: { en: "Pasta: {pasta}g | Lean Ground Beef: {beef}g | Cheddar/Parmesan: {cheese}g", ka: "მაკარონი: {pasta}გ | ძროხის ფარში: {beef}გ | ყველი: {cheese}გ", ru: "Макароны: {pasta}г | Фарш говяжий: {beef}г | Сыр: {cheese}г" },
    steps: { en: "1. Boil pasta.\n2. Sauté minced beef with tomato sauce, mix with pasta and melt cheese on top.", ka: "1. მოხარშეთ მაკარონი.\n2. მოთუშეთ ფარში ტომატში, შეურიეთ მაკარონი და მოაყარეთ ყველი.", ru: "1. Отварить макароны.\n2. Обжарить фарш с томатным соусом, смешать с макаронами и сыром." }
  },
  {
    goal: "gain",
    cat: "snack",
    name: { en: "Nuts, Dried Fruits & Cottage Cheese", ka: "თხილეულის, ჩირისა და ხაჭოს თასი", ru: "Творог с орехами и сухофруктами" },
    baseCals: 480,
    baseGrams: { en: "Full-Fat Cottage Cheese: {cottage}g | Walnuts & Almonds: {nuts}g | Honey: 25g", ka: "ცხიმიანი ხაჭო: {cottage}გ | ნიგოზი/ნუში: {nuts}გ | თაფლი: 25გ", ru: "Жирный творог: {cottage}г | Орехи: {nuts}г | Мед: 25г" },
    steps: { en: "1. Mix cottage cheese with crushed nuts and honey.", ka: "1. შეურიეთ ხაჭო დაჭრილ ნიგოზსა და თაფლს.", ru: "1. Смешать творог с орехами и медом." }
  },

  // MAINTAIN
  {
    goal: "maintain",
    cat: "breakfast",
    name: { en: "Eggs, Avocado Toast & Smoked Salmon", ka: "კვერცხი, ავოკადოს ტოსტი და ორაგული", ru: "Яйца, тост с авокадо и лососем" },
    baseCals: 520,
    baseGrams: { en: "Eggs: 2 pcs | Whole Grain Bread: {bread} slices | Avocado: {avo}g | Salmon: {salmon}g", ka: "კვერცხი: 2 ცალი | შავი პური: {bread} ნაჭერი | ავოკადო: {avo}გ | ორაგული: {salmon}გ", ru: "Яйца: 2 шт | Хлеб: {bread} ломтика | Авокадо: {avo}г | Лосось: {salmon}г" },
    steps: { en: "1. Toast bread, top with mashed avocado, smoked salmon, and poached eggs.", ka: "1. გააცხელეთ პური, გადაუსვით ავოკადო, დაალაგეთ ორაგული და კვერცხი.", ru: "1. Поджарить хлеб, выложить авокадо, лосось и яйца." }
  },
  {
    goal: "maintain",
    cat: "lunch",
    name: { en: "Chicken Bowl with Quinoa & Veggies", ka: "ქათმის თასი კინოათი და ბოსტნეულით", ru: "Боул с курицей, киноа и овощами" },
    baseCals: 580,
    baseGrams: { en: "Chicken Breast: {chk}g | Cooked Quinoa: {quin}g | Vegetables: 150g | Olive Oil: 12ml", ka: "ქათმის მკერდი: {chk}გ | მოხარშული კინოა: {quin}გ | ბოსტნეული: 150გ | ზეითუნის ზეთი: 12მლ", ru: "Куриная грудка: {chk}г | Вареная киноа: {quin}г | Овощи: 150г | Оливковое масло: 12мл" },
    steps: { en: "1. Grill chicken breast.\n2. Mix with cooked quinoa, roasted vegetables, and olive oil.", ka: "1. შეწვით ქათამი გრილზე.\n2. შეურიეთ მოხარშულ კინოასა და ბოსტნეულს.", ru: "1. Обжарить куриную грудку.\n2. Смешать с киноа и овощами." }
  },
  {
    goal: "maintain",
    cat: "dinner",
    name: { en: "Cod Fish with Roasted Rosemary Potatoes", ka: "ვირთევზა როზმარინიანი კარტოფილით", ru: "Треска с запеченным картофелем" },
    baseCals: 510,
    baseGrams: { en: "Cod Fillet: {fish}g | Baby Potatoes: {pot}g | Olive Oil: 10ml", ka: "ვირთევზას ფილე: {fish}გ | ბეიბი კარტოფილი: {pot}გ | ზეითუნის ზეთი: 10მლ", ru: "Филе трески: {fish}г | Картофель: {pot}г | Оливковое масло: 10мл" },
    steps: { en: "1. Roast baby potatoes with rosemary for 20 mins.\n2. Bake fish alongside for 12 mins.", ka: "1. გამოაცხვეთ კარტოფილი როზმარინით 20 წუთით.\n2. გვერდით მიუდეთ თევზი ბოლო 12 წუთი.", ru: "1. Запечь картофель с розмарином 20 минут.\n2. Добавить рыбу на последние 12 минут." }
  },
  {
    goal: "maintain",
    cat: "snack",
    name: { en: "Apple Slices with Almond Butter", ka: "ვაშლის ნაჭრები ნუშის კარაქით", ru: "Яблоко с миндальной пастой" },
    baseCals: 260,
    baseGrams: { en: "Large Apple: 1 pc | Almond Butter: {butter}g", ka: "დიდი ვაშლი: 1 ცალი | ნუშის კარაქი: {butter}გ", ru: "Яблоко: 1 шт | Миндальная паста: {butter}г" },
    steps: { en: "1. Slice apple and dip into creamy almond butter.", ka: "1. დაჭერით ვაშლი და მიირთვით ნუშის კარაქთან ერთად.", ru: "1. Нарезать яблоко и макать в миндальную пасту." }
  }
];

interface MealItem {
  id: string;
  name: string;
  calories: number;
}

export default function NutritionPage() {
  const [lang, setLang] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [goal, setGoal] = useState("loss");

  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");
  const [activityMultiplier, setActivityMultiplier] = useState("1.2");
  const [targetCalories, setTargetCalories] = useState<number>(2000);

  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [meals, setMeals] = useState<MealItem[]>([]);

  const [selectedRecipeModal, setSelectedRecipeModal] = useState<any | null>(null);

  const loadSettings = () => {
    const savedLang = localStorage.getItem("lifepulse_lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
    const savedTheme = localStorage.getItem("lifepulse_theme");
    setIsDarkMode(savedTheme !== "light");
  };

  useEffect(() => {
    loadSettings();
    const handleLangChange = () => loadSettings();
    window.addEventListener("lifepulse_lang_change", handleLangChange);
    return () => window.removeEventListener("lifepulse_lang_change", handleLangChange);
  }, []);

  useEffect(() => {
    const savedMeals = localStorage.getItem("lifepulse_nutrition");
    if (savedMeals) {
      try {
        setMeals(JSON.parse(savedMeals));
      } catch (e) {
        console.error(e);
      }
    }
    const savedGoal = localStorage.getItem("lifepulse_nutrition_goal");
    if (savedGoal) {
      setGoal(savedGoal);
    }
  }, []);

  const handleGoalChange = (newGoal: string) => {
    setGoal(newGoal);
    localStorage.setItem("lifepulse_nutrition_goal", newGoal);
  };

  const calculateCalories = () => {
    const w = parseFloat(weight) || 70;
    const h = parseFloat(height) || 175;
    const a = parseInt(age) || 25;
    const mult = parseFloat(activityMultiplier) || 1.2;

    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    let tdee = bmr * mult;

    if (goal === "loss") {
      tdee -= 500;
    } else if (goal === "gain") {
      tdee += 400;
    }

    const finalTarget = Math.max(1200, Math.round(tdee));
    setTargetCalories(finalTarget);
  };

  const t = translations[lang] || translations.en;

  const quickAddMeal = (name: string, cals: number) => {
    const newItem: MealItem = {
      id: Date.now().toString() + Math.random(),
      name,
      calories: cals,
    };
    const updated = [newItem, ...meals];
    setMeals(updated);
    localStorage.setItem("lifepulse_nutrition", JSON.stringify(updated));
  };

  const addMeal = () => {
    if (!mealName.trim() || !calories) return;

    const newItem: MealItem = {
      id: Date.now().toString(),
      name: mealName,
      calories: Number(calories) || 0,
    };

    const updated = [newItem, ...meals];
    setMeals(updated);
    localStorage.setItem("lifepulse_nutrition", JSON.stringify(updated));
    setMealName("");
    setCalories("");
  };

  const deleteMeal = (id: string) => {
    const updated = meals.filter((m) => m.id !== id);
    setMeals(updated);
    localStorage.setItem("lifepulse_nutrition", JSON.stringify(updated));
  };

  const totalCals = meals.reduce((sum, item) => sum + item.calories, 0);

  // Dynamic Scaling Factor based on Calculated Target Calories
  const scaleRatio = targetCalories / 2000;

  const getScaledGramsText = (rawPattern: string) => {
    return rawPattern
      .replace("{oats}", Math.round(50 * scaleRatio).toString())
      .replace("{prot}", Math.round(30 * scaleRatio).toString())
      .replace("{berry}", Math.round(80 * scaleRatio).toString())
      .replace("{almond}", Math.round(15 * scaleRatio).toString())
      .replace("{turkey}", Math.round(150 * scaleRatio).toString())
      .replace("{broc}", Math.round(200 * scaleRatio).toString())
      .replace("{oil}", Math.round(10 * scaleRatio).toString())
      .replace("{salmon}", Math.round(160 * scaleRatio).toString())
      .replace("{greens}", Math.round(100 * scaleRatio).toString())
      .replace("{yogurt}", Math.round(200 * scaleRatio).toString())
      .replace("{chia}", Math.round(20 * scaleRatio).toString())
      .replace("{milk}", Math.round(300 * scaleRatio).toString())
      .replace("{pb}", Math.round(35 * scaleRatio).toString())
      .replace("{steak}", Math.round(200 * scaleRatio).toString())
      .replace("{rice}", Math.round(220 * scaleRatio).toString())
      .replace("{avo}", Math.round(80 * scaleRatio).toString())
      .replace("{pasta}", Math.round(160 * scaleRatio).toString())
      .replace("{beef}", Math.round(150 * scaleRatio).toString())
      .replace("{cheese}", Math.round(35 * scaleRatio).toString())
      .replace("{cottage}", Math.round(220 * scaleRatio).toString())
      .replace("{nuts}", Math.round(30 * scaleRatio).toString())
      .replace("{bread}", scaleRatio > 1.2 ? "3" : "2")
      .replace("{chk}", Math.round(160 * scaleRatio).toString())
      .replace("{quin}", Math.round(150 * scaleRatio).toString())
      .replace("{fish}", Math.round(180 * scaleRatio).toString())
      .replace("{pot}", Math.round(200 * scaleRatio).toString())
      .replace("{butter}", Math.round(25 * scaleRatio).toString());
  };

  const currentGoalMeals = baseMealsDb.filter((m) => m.goal === goal);

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-12 transition-colors duration-300 relative overflow-hidden ${
      isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#FDFBF7] text-[#2C221E]"
    }`}>
      <div className="max-w-5xl mx-auto w-full space-y-8 animate-fade-in relative z-10">
        
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-6 flex-wrap gap-4 glass-card ${
          isDarkMode ? "border-zinc-800/80" : "border-[#E5DFD3]"
        }`}>
          <Link 
            href="/" 
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold smooth-transition flex items-center gap-2 border cursor-pointer ${
              isDarkMode 
                ? "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-800" 
                : "bg-white/80 hover:bg-[#EFECE6] text-[#2C221E] border-[#DCD6C8]"
            }`}
          >
            {t.back}
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xl">🥗</span>
            <h1 className="text-xl font-extrabold tracking-tight">{t.title}</h1>
          </div>
        </div>

        {/* Goal Selector */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-3 glass-card ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white/80 border-[#E5DFD3]"
        }`}>
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">{t.goalLabel}</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "loss", label: t.goalLoss, icon: "🔥" },
              { id: "gain", label: t.goalGain, icon: "💪" },
              { id: "maintain", label: t.goalMaintain, icon: "⚖️" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleGoalChange(item.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                  goal === item.id
                    ? "bg-amber-500 text-zinc-950 border-amber-400 font-black scale-[1.02]"
                    : isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                    : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E] hover:bg-[#E5DFD3]"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calorie Calculator */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 glass-card ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white/80 border-[#E5DFD3]"
        }`}>
          <h2 className="text-base font-bold flex items-center gap-2">
            <span>🧮</span> {t.calcTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 block">{t.weight}</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-bold ${
                  isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 block">{t.height}</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-bold ${
                  isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 block">{t.age}</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-bold ${
                  isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 block">{t.gender}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border text-xs font-bold cursor-pointer ${
                  isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
                }`}
              >
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 block">{t.activity}</label>
            <select
              value={activityMultiplier}
              onChange={(e) => setActivityMultiplier(e.target.value)}
              className={`w-full px-4 py-3 rounded-2xl border text-xs font-bold cursor-pointer ${
                isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
              }`}
            >
              <option value="1.2">{t.sedentary}</option>
              <option value="1.375">{t.light}</option>
              <option value="1.55">{t.moderate}</option>
              <option value="1.725">{t.active}</option>
            </select>
          </div>

          <button
            onClick={calculateCalories}
            className="w-full py-3.5 rounded-2xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg cursor-pointer smooth-transition"
          >
            {t.calculate}
          </button>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
            <p className="text-xs font-bold text-amber-400">{t.targetResult}</p>
            <p className="text-3xl font-black text-amber-400">{targetCalories} kcal</p>
          </div>
        </div>

        {/* Dynamic Meal Options Scaled to User Target */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 glass-card ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white/80 border-[#E5DFD3]"
        }`}>
          <h2 className="text-base font-bold flex items-center gap-2">
            <span>🍳</span> {t.recipeTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentGoalMeals.map((item, idx) => {
              const scaledCals = Math.round(item.baseCals * scaleRatio);
              const mName = item.name[lang as keyof typeof item.name] || item.name.en;
              const catLabel = t.categories[item.cat as keyof typeof t.categories];

              return (
                <div key={idx} className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  isDarkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-[#F4F0EA] border-[#DCD6C8]"
                }`}>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-lg">
                      {catLabel}
                    </span>
                    <div className="flex justify-between items-start gap-2 pt-1">
                      <h3 className="text-sm font-bold text-amber-400">{mName}</h3>
                      <span className="text-xs font-black text-white bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-xl shrink-0">
                        {scaledCals} kcal
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setSelectedRecipeModal({ ...item, scaledCals })}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 cursor-pointer smooth-transition text-center"
                    >
                      {t.viewRecipe}
                    </button>
                    <button
                      onClick={() => quickAddMeal(mName, scaledCals)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer smooth-transition"
                    >
                      + Log
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Meal Input */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4 glass-card ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white/80 border-[#E5DFD3]"
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder={t.mealName}
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className={`sm:col-span-2 px-4 py-3.5 rounded-2xl border text-xs font-medium transition-all ${
                isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
              }`}
            />
            <input
              type="number"
              placeholder={t.calories}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className={`px-4 py-3.5 rounded-2xl border text-xs font-medium transition-all ${
                isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#F4F0EA] border-[#DCD6C8] text-[#2C221E]"
              }`}
            />
          </div>

          <button
            onClick={addMeal}
            className="w-full py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg cursor-pointer smooth-transition"
          >
            {t.addMeal}
          </button>
        </div>

        {/* Nutrition Log */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 glass-card ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white/80 border-[#E5DFD3]"
        }`}>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-base font-bold">{t.dailyLog}</h2>
            <div className="text-xs font-black text-amber-400 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
              🔥 {t.totalCalories}: {totalCals} / {targetCalories} kcal
            </div>
          </div>

          {meals.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="text-3xl">🥗</div>
              <p className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-[#7B6E63]"}`}>{t.noMeals}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((item) => (
                <div key={item.id} className={`p-4 rounded-2xl border flex justify-between items-center ${
                  isDarkMode ? "bg-zinc-950 border-zinc-800/80" : "bg-[#F4F0EA] border-[#DCD6C8]"
                }`}>
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-amber-400 font-semibold">🔥 {item.calories} kcal</p>
                  </div>
                  <button
                    onClick={() => deleteMeal(item.id)}
                    className="text-xs text-zinc-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-rose-500/40 cursor-pointer"
                  >
                    🗑️ {t.delete}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recipe Modal with Dynamic Grams */}
      {selectedRecipeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className={`max-w-lg w-full p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 relative glass-card ${
            isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-[#DCD6C8] text-[#2C221E]"
          }`}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-black text-amber-400">
                  {selectedRecipeModal.name[lang as keyof typeof selectedRecipeModal.name] || selectedRecipeModal.name.en}
                </h3>
                <span className="text-xs font-bold opacity-70">🔥 {selectedRecipeModal.scaledCals} kcal</span>
              </div>
              <button
                onClick={() => setSelectedRecipeModal(null)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                {t.closeModal}
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t.ingredients}</h4>
                <p className="text-xs font-medium leading-relaxed opacity-90 p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800">
                  {getScaledGramsText(
                    selectedRecipeModal.baseGrams[lang as keyof typeof selectedRecipeModal.baseGrams] || selectedRecipeModal.baseGrams.en
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t.instructions}</h4>
                <p className="text-xs font-medium leading-relaxed whitespace-pre-line opacity-90 p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800">
                  {selectedRecipeModal.steps[lang as keyof typeof selectedRecipeModal.steps] || selectedRecipeModal.steps.en}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const mName = selectedRecipeModal.name[lang as keyof typeof selectedRecipeModal.name] || selectedRecipeModal.name.en;
                quickAddMeal(mName, selectedRecipeModal.scaledCals);
                setSelectedRecipeModal(null);
              }}
              className="w-full py-3.5 rounded-2xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg cursor-pointer"
            >
              + {t.addMeal}
            </button>
          </div>
        </div>
      )}

      <footer className="text-center text-xs text-zinc-500 py-6 relative z-10">
        LifePulse OS — Premium Edition.
      </footer>
    </div>
  );
}