const columnify = require('columnify');

class Month {
  constructor(userYear, userMonth) {
    // 月初の日付
    this.startDayOfMonth = 1;
    // 月末の日付
    this.lastDayOfMonth = new Date(userYear, userMonth, 0).getDate();
    // 月の初週の曜日数（日 -> 0, 月 ->1..）
    this.startDayOfFirstWeek = new Date(userYear, userMonth - 1, 1).getDay();
    // 月の週の数
    this.weekRow = Math.ceil((this.startDayOfFirstWeek + this.lastDayOfMonth) / 7);
    // 隔週の固定曜日
    this.weekMember = {
      Sun: '',
      Mon: '',
      Tue: '',
      Wed: '',
      Thu: '',
      Fri: '',
      Sat: ''
    };
  }

  // 指定された月の隔週に、日付をセットした変数を返すメソッド
  getWeek(firstDateOfTheWeek, targetWeek = this.weekMember) {
    /// 属月的な週オブジェクトを、自身のweekMember属性をシャローコピーしたものを使用して作成。
    let week = Object.assign({},this.weekMember);
    for (let day in targetWeek) {
      week[day] = firstDateOfTheWeek++;
    }
    return week;
  }

  // 初週と最終週から先月分と来月分の日付を除去するメソッド
  setWeek(startDay, endDay){
    return Object.fromEntries(
      Object.entries(this.weekMember).slice(startDay, endDay)
    );
  }
}

function makeMonthCalender(userYear, userMonth) {

  if (!(userYear && userMonth)) {
    throw new Error('年と月を入力してください。');
  } else if (!(new Date(userYear) instanceof Date) || !(new Date(userMonth) instanceof Date)) {
    throw new Error('年と月を次のような形式で入力してください。=>（例）2021 09');
  }

  const month = new Month(userYear, userMonth);
  const results = [];

  for (let i = 0; i < month.weekRow; i++) {
    let weekMember;

    // 初週
    if (i === 0) {
      const endDayOfWeek = 7;
      const firstWeekMember = month.setWeek(month.startDayOfFirstWeek, endDayOfWeek);
      weekMember = month.getWeek(month.startDayOfMonth, firstWeekMember);

    // 初週と最終週以外の週（中週）　
    } else if ((i >= 1) && (i < month.weekRow - 1)) {
      weekMember = month.getWeek(month.startDayOfWeek);

    // 最終週
    } else {
      const remainDays = month.lastDayOfMonth - month.startDayOfWeek;
      const lastWeekMember = month.setWeek(0, remainDays+1);
      weekMember = month.getWeek(month.startDayOfWeek, lastWeekMember);
    }

    results.push(weekMember);

    // 次週の頭の日付を設定
    month.startDayOfWeek = weekMember["Sat"] + 1;
  }

  //　表示用のカレンダーを設定。
  const columns = columnify(results, {
    columnSplitter: ' | '
  });

  // コンソールに出力
  console.log(columns);
}

try {
  makeMonthCalender(process.argv[2], process.argv[3]);
} catch (error) {
  console.log(error.message);
}