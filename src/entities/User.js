export const User = {
  async me() {
    // Моковые данные пользователя
    return {
      email: "mirlan@example.com",
      name: "Мирлан",
      favorites: [1209, 1244]
    };
  }

};