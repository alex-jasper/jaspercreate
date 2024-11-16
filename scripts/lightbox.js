function initLightbox() {
    $('.lightbox').off('click').on('click', function (e) {
        e.preventDefault();
        var fullImageSrc = $(this).attr('href');

        // Display the lightbox overlay with a loading spinner
        var lightboxHtml = `
            <div class="lightbox-overlay">
                <div class="lightbox-spinner"></div>
                <img src="${fullImageSrc}" alt="Full Image" class="lightbox-content" style="display:none;" />
                <img src="/img/close.png" alt="Close" class="close-lightbox" />
            </div>`;

        $('body').append(lightboxHtml);

        const image = $('.lightbox-content');
        const spinner = $('.lightbox-spinner');

        // Hide the spinner and show the image when it fully loads
        image.on('load', function () {
            spinner.hide();
            image.fadeIn(); // Smoothly show the image
        });

        // Close lightbox functionality when clicking the close image
        $('.close-lightbox').on('click', function () {
            $('.lightbox-overlay').remove();
        });

        // Close lightbox when clicking outside the image
        $('.lightbox-overlay').on('click', function (e) {
            if ($(e.target).hasClass('lightbox-overlay')) {
                $('.lightbox-overlay').remove();
            }
        });
    });
}