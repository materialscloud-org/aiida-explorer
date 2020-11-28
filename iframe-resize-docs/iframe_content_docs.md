# Documentation on what to do in the pages to be embedded within a `<iframe>`

**Note**: The following has to be done for EVERY HTML page that will be
accessed within the iframe.
In case of doubt, do it in all your pages, since all things typically don't 
harm.

- Make sure the first line of your HTML page is
  
  ```
  <!DOCTYPE html>
  ```

- add the `iframeResizer.contentwindow.min.js` and `iframeResizer.contentwindow.map` files in a place accessible in your website

- add the following line in the `<head>` section:
  
  ```
  <script src="iframeResizer.contentwindow.min.js"></script>
  ```
  (the file is provided by us - it comes from
  https://github.com/davidjbradshaw/iframe-resizer)

- at the very bottom of your document, right before the `</body>` tag,
  add an empty div with the following 
  content (this is *essential* to have the host understand the page size; make
  sure, if you use custom CSS, that the div is the most bottom element in the
  page, it is used as a marker to compute the page height):

  ```
  <div style ="position: relative" data-iframe-height></div>
  ```
- for any link that should open in a new page, make sure you add `target="_blank"`
  to the `<a>` tag (e.g. for external links) or `target="_top"` to open in the
  same window/tab, but not inside the iframe (i.e. replaces the host page).
  All other links will be opened inside the iframe, but note that there is no
  visual indicator that something is happening, so if the loading is slow, the
  user will think the site is broken.

  Also, note that the 'back' button might not work as expected when navigating
  inside an iframe.


# Documentation on what to do in the hosting pages

- Make sure the first line of your HTML page is
  
  ```
  <!DOCTYPE html>
  ```

- add the iframeResizer.min.js and iframeResizer.map files somewhere accessible

- add the following line in the `<head>` section:
  
  ```
  <script src="iframeResizer.min.js"></script>
  ```
  (the file is provided by us - it comes from
  https://github.com/davidjbradshaw/iframe-resizer)

- At the position where you want the iframe, embed:

  ```
  <iframe id="contentiframe" src="<ADDRESS_OF_CONTENT_PAGE>" scrolling="no" style="width: 100%; border: 0px;"></iframe>
  <script>
    iFrameResize({
        log: false,
        heightCalculationMethod: 'taggedElement',
        inPageLinks: true,
        minHeight: '100 px',
    }, '#contentiframe')
  </script>
  ```
  Some notes:
  - it is essential to give an ID to the iframe
  - replace `<ADDRESS_OF_CONTENT_PAGE>` with the proper address
  - it's important to set `scrolling="no"`; the JS library will dynamically 
    resize the iframe height
  - by default the width is instead not changed; set it to 100% of a div
    inside which you put the iframe - this will make any responsive content
    inside the content page work as expected
  - in many browsers iframes have a border, so set this to zero pixels
  - after the iframe, add the script to start the monitoring of the height.
    You can specify a number of options, that you can check in the documentation
    of https://github.com/davidjbradshaw/iframe-resizer but there are a few
    that should not be changed:
    - `heightCalculationMethod`: use `taggedElement`, that looks for a special
      tag in the content page marking the bottom. See what is explained also
      for content pages above.
      NOTE: other options are possible, but have often disadvantages. In my 
      experience, e.g.:
      - `bodyScroll` causes flicker of the page when it changes size
      - `bodyOffset` is better, but sometimes it cuts out a few pixels 
        at the bottom
      - `inPageLinks`: leave it to true, so that the library does some magic
        to make anchor links work
  - Other options that might be changed include:
    - `log`: set to False for production to avoid excessive logging that would
      also slow down a bit the page
    - `minHeight` makes sure the div does not start with height zero in case
      of problems (e.g. no JS in the browser) or if they forget to put
      the marking div in the content page at its bottom

# Notes
- if the two documents are in the same domain, the library still works but
  would not be necesssary, one could do things like

  ```
  $('#contentiframe').style.height = $('#contentiframe').contentDocument.body.offsetHeight
  ```

# Known issues
- if one forgets to put the final div the height is not calculated. However
  the user will notice it
- the `inPageLinks` option should make anchor links work properly, but this has
  not been tested in all browser configurations yet...
- Refreshing the page reload the host page, and goes back to the initial page
  in the iframe
- The back button might not be working as expected
