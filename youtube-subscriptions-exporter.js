(async () => {
   const dialog = document.createElement("dialog");
   const label = document.createElement("label");
   const progress = document.createElement("progress");
   dialog.style.cssText = "display: flex; flex-direction: column; gap: 15px; padding: 20px;";
   dialog.appendChild(label);
   dialog.appendChild(progress);
   document.querySelector("ytd-app").appendChild(dialog);
   dialog.showModal();
   label.innerText = "Loading subscriptions...";
   const content = document.getElementById("content");
   let contentH;
   do {
      contentH = content.offsetHeight;
      window.scrollBy(0, 100000);
      await new Promise((r) => setTimeout(r, 500));
   } while (content.querySelector("#spinnerContainer.active") != null || content.offsetHeight > contentH);
   try {
      const channelElements = [...content.querySelectorAll("ytd-browse:not([hidden]) #main-link.channel-link")];
      progress.max = channelElements.length;
      progress.value = 0;
      const channelUrls = [];
      for (const e of channelElements) {
         label.innerText = `Fetching URLS... (${progress.value}/${progress.max})`;
         try {
            channelUrls.push(e.href);
         } finally {
            progress.value++;
            progress.replaceWith(progress);
         }
      }
      if (channelElements.length === 0) alert("Couldn't find any subscriptions");
      const missedChannels = channelElements.length - channelUrls.length;
      if (missedChannels > 0)
         alert(`${missedChannels} channel${missedChannels > 1 ? "s" : ""} couldn't be fetched fully. The URLs obtained might still be useful.`);

      if (channelUrls.length > 0) {
         const textContent = channelUrls.join("\n");
         const blob = new Blob([textContent], { type: "text/plain" });
         const url = window.URL.createObjectURL(blob);
         const anchorTag = document.createElement("a");
         anchorTag.setAttribute("download", "youtube_channel_urls.txt");
         anchorTag.setAttribute("href", url);
         anchorTag.dataset.downloadurl = `text/plain:youtube_channel_urls.txt:${url}`;
         anchorTag.click();
      }
   } catch (e) {
      console.error(e);
      alert("Something went wrong. Check the console for more info.");
   } finally {
      dialog.close();
      dialog.remove();
   }
})();
