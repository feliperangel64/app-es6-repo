import api from './api';

class App {
  constructor() {
    this.repositories = [];
    this.form = document.getElementById("repo-form");
    this.list = document.getElementById("repo-list");
    this.input = document.querySelector("input[name=repository]");
    this.registerHandlers();
  }

  registerHandlers() {
    this.form.onsubmit = (event) => this.addRepository(event);
  }

  setLoading(loading = true) {
    if (loading) {
      let loadEl = document.createElement("span");
      loadEl.setAttribute("id", "loading")
      loadEl.appendChild(document.createTextNode("Carregando"));
      this.form.appendChild(loadEl);
    } else {
      document.querySelector("#loading").remove();
    }
  }

  async addRepository(event) {
    event.preventDefault();
    if (this.input.value === "")
      return;

    this.setLoading();

    try {
      const response = await api.get(`/repos/${this.input.value}`);
      const { name, description, html_url, owner: { avatar_url } } = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url,
      });

      this.input.value = "";
      this.render();
    } catch (err) {
      alert("Não foi possível encontrar o repositório.")
    }

    this.setLoading(false);
  }

  render() {

    this.list.innerHTML = "";
    this.repositories.forEach((repo) => {
      let imgEl = document.createElement("img");
      imgEl.setAttribute("src", repo.avatar_url);

      let nameEl = document.createElement("strong");
      nameEl.appendChild(document.createTextNode(repo.name));

      let descEl = document.createElement("p");
      descEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement("a");
      linkEl.setAttribute("href", repo.html_url);
      linkEl.setAttribute("target", "_blanck");
      linkEl.appendChild(document.createTextNode("Acessar"));

      let liEl = document.createElement("li");
      liEl.appendChild(imgEl);
      liEl.appendChild(nameEl);
      liEl.appendChild(descEl);
      liEl.appendChild(linkEl);

      this.list.appendChild(liEl);
    });
  }
}
const MyApp = new App();
