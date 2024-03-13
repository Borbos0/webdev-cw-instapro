import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, page, updatePosts } from "../index.js";
import { addLike, removeLike, getPosts } from "../api.js";
// import { formatDistanceToNow } from 'date-fns'
// import ru from 'date-fns/locale'


export function renderPostsPageComponent({ appEl, token }) {
  console.log(appEl);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = posts.map((comment, index) => {
return `
<div class="page-container">
<div class="header-container"></div>
<ul class="posts">
  <li class="post">
    <div class="post-header" data-user-id="${comment.user.id}">
        <img src="${comment.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${comment.user.name}</p>
    </div>
    <div class="post-image-container">
      <img class="post-image" src="${comment.imageUrl}">
    </div>
    <div class="post-likes">
      <button data-id="${comment.id}" data-index="${index}" class="like-button">
        <img src=${comment.isLiked ? `./assets/images/like-active.svg` : `./assets/images/like-not-active.svg`} >
      </button>
      <p class="post-likes-text">
        Нравится: <strong>${comment.likes.length > 0 ? `${comment.likes[comment.likes.length-1]?.name} и еще ${comment.likes.length-1}` : `0`}</strong>
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${comment.user.name}</span>
      ${comment.description}
    </p>
    <p class="post-date">
    ${comment.createdAt}
    </p>
  </li>
</ul>
</div>`
  }).join("");

  appEl.innerHTML = appHtml;
  initLikeButtonsListeners();
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
// Работа кнопки like
function initLikeButtonsListeners() {
    const likeButtonsElements = document.querySelectorAll(".like-button");
	for (const likeButtonsElement of likeButtonsElements) {
		likeButtonsElement.addEventListener("click", (event) => {
			event.stopPropagation();
			const index = likeButtonsElement.dataset.index;
			const id = likeButtonsElement.dataset.id;
			if (posts[index].isLiked === true) {
        return removeLike({token, id})
        .then(() => {updatePosts(token)})
      }
      return addLike ({token, id})
      .then(() => {updatePosts(token)})
      })
	}
  };
}
