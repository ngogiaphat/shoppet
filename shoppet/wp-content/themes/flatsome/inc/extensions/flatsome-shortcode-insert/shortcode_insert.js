(function(){
    tinymce.PluginManager.add('ux_shortcode_insert', function(editor, url){
        editor.addButton('ux_shortcode_insert', {
           text: 'Shortcodes',
            type: 'menubutton',
            tooltip: 'Add Shortcodes and Content',
            menu: [
                {
                    text: 'Section / Background',
                    icon: 'icon dashicons-align-none',
                    onclick: function(){
                        ux_add_section(editor);
                    },
                },
                {
                    text: 'Row / Columns',
                    icon: 'icon dashicons-text',
                    onclick: function(){
                        ux_add_row(editor);
                    },
                },
                {
                    text: 'UX Slider',
                    icon: 'icon  dashicons-images-alt2',
                    menu: [
                            {
                                text: 'Simple slider',
                                value: '[ux_slider timer="4500" arrows="true" bullets="true" auto_slide="true" nav_color="dark"]<br> Insert slides here (UX Banner or Sections) <br>[/ux_slider]',
                                onclick: function(e){
                                    e.stopPropagation();
                                    editor.insertContent(this.value());
                                }       
                            },
                            {
                                text: 'Slider with columns',
                                value: '[ux_slider timer="4500" arrows="true" bullets="false" auto_slide="true" nav_color="dark"]<p>[col span="1/4"] Content [/col]<br/><br>[col span="1/4"] Content [/col]<br/><br>[col span="1/4"] Content [/col]<br/><br>[col span="1/4"] Content [/col]<br/><br>[col span="1/4"] Content [/col]<br/></p>[/ux_slider]',
                                onclick: function(e){
                                    e.stopPropagation();
                                    editor.insertContent(this.value());
                                }       
                            },
                            {
                                text: 'Logo / brand slider',
                                value: '[ux_slider height="60px" arrows="true" bullets="false" nav_color="dark" margin="0px"]<br><br/>[logo title="Logo title" img="http://imageurl" height="60px"]<br/><br/>[logo title="Logo title" img="http://imageurl" height="60px"]<br/><br/>[logo title="Logo title" img="http://imageurl" height="60px"]<br/><br/>[logo title="Logo title" img="http://imageurl" height="60px"]<br/><br/>[logo title="Logo title" img="http://imageurl" height="60px"]<br/>[logo title="Logo title" img="http://imageurl" height="60px"]<br/><br/>[logo title="Logo title" img="http://imageurl" height="60px"]<br/><br/>[/ux_slider]',
                                onclick: function(e){
                                    e.stopPropagation();
                                    editor.insertContent(this.value());
                                }       
                            },

                        ]   
                },
                {
                    text: 'UX Banner',
                    icon: 'icon dashicons-format-image',
                    onclick: function(){
                        ux_add_uxbanner(editor);
                    },
                },
                {
                    text: 'Elements',
                     icon: 'icon dashicons-screenoptions',
                    onclick: function(){
                        editor.insertContent(this.value());
                    },
                    menu: [
                        {
                            text: 'Icon Box',
                            menu: [
                                {
                                    text: 'Icon Top Center',
                                    value: '[featured_box title="Title text" img="http://iconurl" img_width="" pos="center" link=""]<p>Featured box text</p>[/featured_box]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Icon Top',
                                    value: '[featured_box title="Title text" img="http://iconurl" img_width="" link=""]<p>Featured box text</p>[/featured_box]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Icon Left',
                                    value: '[featured_box title="Title text" pos="left" img="http://iconurl" img_width="" link=""]<p>Featured box text</p>[/featured_box]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },                          
                            ]   
                        },
                        {
                            text: 'Button',
                            menu: [
                                {
                                    text: 'Button - Primary',
                                    value: '[button size="medium" style="primary"  text="Medium button" link="http://" target=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Button - Secondary',
                                    value: '[button size="medium" style="secondary"  text="Medium button" link="http://" target=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Button - Alert',
                                    value: '[button size="medium" style="alert"  text="Medium button" link="http://" target=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Button - Success',
                                    value: '[button size="medium" style="success"  text="Medium button" link="http://"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Button - White',
                                    value: '[button size="medium" style="white"  text="Medium button" link="http://"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                 {
                                    text: 'Alt Button - Primary ',
                                    value: '[button size="medium" style="is-outline primary"  text="Medium button" link="http://" target=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Alt Button - Secondary',
                                    value: '[button size="medium" style="is-outline secondary"  text="Medium button" link="http://" target=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Alt button - Success',
                                    value: '[button size="medium" style="is-outline success"  text="Medium button" link="http://"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Alt button - White',
                                    value: '[button size="medium" style="is-outline white"  text="Medium button" link="http://"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                               
                            ]    
                        },
                        {
                            text: 'Tabs / Accordion',
                            onclick: function(e){
                            },
                            menu: [
                                {
                                    text: 'Tabs - Horizontal',
                                    value: '[tabgroup title="Tab group title"]<br>[tab title="Tab 1 Title"] Tab content [/tab]<br>[tab title="Tab 2 Title"] Tab content [/tab]<br>[tab title="Tab 3 Title"] Tab content [/tab]<br>[/tabgroup]<br>',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Tabs - Horizontal Centered',
                                    value: '[tabgroup style="center" title=""]<br>[tab title="Tab 1 Title"] Tab content [/tab]<br>[tab title="Tab 2 Title"] Tab content [/tab]<br>[tab title="Tab 3 Title"] Tab content [/tab]<br>[/tabgroup]<br>',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Tabs - Horizontal Pills',
                                    value: '[tabgroup style="pills" title=""]<br>[tab title="Tab 1 Title"] Tab content [/tab]<br>[tab title="Tab 2 Title"] Tab content [/tab]<br>[tab title="Tab 3 Title"] Tab content [/tab]<br>[/tabgroup]<br>',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Tabs - Vertical',
                                    value: '[tabgroup_vertical title=""]<br>[tab title="Tab 1 Title"] Tab content [/tab]<br>[tab title="Tab 2 Title"] Tab content [/tab]<br>[tab title="Tab 3 Title"] Tab content [/tab]<br>[/tabgroup_vertical]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Accordion',
                                    value: '[accordion title="Accordion title"]<br><br>[accordion-item title="Accordion Item 1 Title"]<br>Accordion Item 1 Content Goes Here<br>[/accordion-item]<br><br>[accordion-item title="Accordion Item 1 Title"]<br>Accordion Item 1 Content Goes Here<br>[/accordion-item]<br><br>[accordion-item title="Accordion Item 1 Title"]<br> Accordion Item 1 Content Goes Here<br> [/accordion-item]<br><br>[/accordion]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                }
                            ]
                        },
                        {
                            text: 'Map',
                            value: '[map lat="40.79028" long="-73.95972" height="500px" color="#58728a"] Enter map content here.. [/map]',
                            onclick: function(e){
                                e.stopPropagation();
                                editor.insertContent(this.value());
                            }       
                        },
                        {
                            text: 'Blog Posts',
                            menu: [
                                {
                                    text: 'Blog Post Slider',
                                    value: '[blog_posts posts="6" columns="3" image_height="200px" show_date="true"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Blog Post Slider - Text overlay',
                                    value: '[blog_posts columns="3" style="text-overlay" posts="8" category="" image_height="150px" show_date="true"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Blog Post Slider - Text Bounce',
                                    value: '[blog_posts columns="3" style="text-bounce" posts="8" category="" image_height="150px" show_date="true"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                }
                            ]  
                        },
                        {
                            text: 'Titles / Dividers',
                            value: 'Text from sub sub menu',
                            menu: [
                                {
                                    text: 'Title - Left',
                                    value: '[title text="This is a title" link="" link_text=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Title - Center',
                                    value: '[title text="This is a centered title" style="center"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Title - Bold Left',
                                    value: '[title text="This is a bold title" style="bold"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Title - Bold Center',
                                    value: '[title text="This is a bold centered title" style="bold_center"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Title - Left (With link)',
                                    value: '[title text="This is a title" link="#" link_text="Title link"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Divider',
                                    value: '[divider]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Divider - Full Width',
                                    value: '[divider width="full"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Divider - Small',
                                    value: '[divider width="small"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Divider - Medium',
                                    value: '[divider width="medium"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Gap - 30px',
                                    value: '[gap height="30px"]',
                                    onclick: function(e) {
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Gap - 60px',
                                    value: '[gap height="60px"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Gap - 15px',
                                    value: '[gap height="15px"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                }

                            ]   
                        },
                        {
                            text: 'Follow / Share',
                            menu: [
                                {
                                    text: 'Follow Icons',
                                    value: '[follow twitter="http://" facebook="http://" email="email@post.com" pinterest="http://" rss="http://" instagram="http://" googleplus="http://"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Follow Icons - Small',
                                    value: '[follow size="small" twitter="http://" facebook="http://" email="email@post.com" pinterest="http://" rss="http://" instagram="http://" googleplus="http://"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Share icons',
                                    value: '[share title=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                               
                            ]   
                        },
                        {
                            text: 'Price Table',
                            value: '[ux_price_table price="99$" title="Awesome title" featured="false" description="This is a description" button_text="Order Now" button_link="#"]<br>[bullet_item text="This is a bullet item"]<br>[bullet_item text="This is a bullet item"]<br>[bullet_item text="This is a bullet item"]<br>[/ux_price_table]',
                            onclick: function(e){
                                e.stopPropagation();
                                editor.insertContent(this.value());
                            }       
                        },
                        {
                            text: 'Testimonial',
                            value: '[testimonial style="" image="http://imageurl" name="Author name" company="Company name" stars="5"]<br> Add testimonial text here <br>[/testimonial]',
                            onclick: function(e){
                                e.stopPropagation();
                                editor.insertContent(this.value());
                            }       
                        },
                        {
                            text: 'Team Member',
                            value: '[team_member name="Name" title="Title" facebook="http://" twitter="http://" pinterest="http://"  img="http://imageurl"]<br>Team member description<br>[/team_member]',
                            onclick: function(e){
                                e.stopPropagation();
                                editor.insertContent(this.value());
                            }       
                        },
                        {
                            text: 'Message Box',
                            value: '[message_box bg="#hex or http://imageurl"] Message box text [/message_box]',
                            onclick: function(e){
                                e.stopPropagation();
                                editor.insertContent(this.value());
                            }       
                        },
                        {
                            text: 'Scroll To Link',
                            value: '[scroll_to link="#scrolltothis" title="Scroll to This"]',
                            onclick: function(e){
                                e.stopPropagation();
                                editor.insertContent(this.value());
                            }       
                        },                        
                    ]
                },{
                    text: 'Shop',
                    icon: 'icon dashicons-cart',
                    onclick: function() {
                        editor.insertContent(this.value());
                    },
                    menu: [
                        {
                            text: 'Product Sliders',
                            menu: [
                                {
                                    text: 'Featured products',
                                    value: '[ux_featured_products products="" columns="4" title="Check our Featured products!"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Best selling products',
                                    value: '[ux_bestseller_products products="" columns="4" title="Check our bestsellers!"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Custom category',
                                    tooltip: 'Show products from an selected category',
                                    value: '[ux_custom_products cat="" products="" columns="4" title="Check our bestsellers!"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Products On Sale',
                                    value: '[ux_sale_products columns="4" title="Check our Products on Sale!"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Latest products',
                                    value: '[ux_latest_products columns="4" title="Check our Latest products!"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                            ]       
                        },
                        {
                            text: 'Categories',
                            menu: [
                                {
                                    text: 'Category Slider',
                                    value: '[ux_product_categories number="10" parent="0" columns="4" title="Our categories" ]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Category Grid - Simple Grid',
                                    value: '[product_categories number="10" parent="0" columns="4" title="Our categories"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Category Grid - New Grid style',
                                    value: '[ux_product_categories_grid number="22" parent="0"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                }
                            ]         
                        },
                        {
                            text: 'Product Lookbook Slider',
                            value: '[product_lookbook cat="category-slug" products="8"]',
                            onclick: function(e){
                                e.stopPropagation();
                                editor.insertContent(this.value());
                            }       
                        },
                        {
                            text: 'Product Pinterest Style Grid',
                            value: '[products_pinterest_style products="" cat="category-slug" columns="4"]',
                            onclick: function(e){
                                e.stopPropagation();
                                editor.insertContent(this.value());
                            }       
                        },
                        {
                            text: 'WooCommerce',
                            menu: [
                                {
                                    text: 'Order Tracking',
                                    value: '[woocommerce_order_tracking]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Product Price/cart button',
                                    value: '[add_to_cart id="" sku=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Products by SKU',
                                    value: '[product id="" sku=""]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Custom products',
                                    value: '[product_category category="" per_page="12" columns="4" orderby="date" order="desc"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Recent products',
                                    value: '[recent_products per_page="12" columns="4" orderby="date" order="desc"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Featured Products',
                                    value: '[featured_products per_page="12" columns="4" orderby="date" order="desc"]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                                {
                                    text: 'Shop messages',
                                    value: '[woocommerce_shop_messages]',
                                    onclick: function(e){
                                        e.stopPropagation();
                                        editor.insertContent(this.value());
                                    }       
                                },
                            ]         
                        },
                    ]
                },
           ]
        });
    });
/* ADD BANNER */
function ux_add_uxbanner(editor){
    var list_style = 'height:90px; width:130px; text-indent: -999px; text-align:center;padding-top:3px; background-repeat:no-repeat;font-size:10px!important;border-top:1px solid #555;';
    ux_selected_image = 'http://imageurl';
    editor.windowManager.open( {
        title: 'Insert UX Banner',
        body: [
        {
            type: 'listbox', 
            name: 'height', 
            label: 'Height',
            tooltip: 'Set height of the banner',
            'values': [
                {text: '500px', value: 'height="500px"'},
                {text: '700px', value: 'height="700px"'},
                {text: '600px', value: 'height="600px"'},
                {text: '400px', value: 'height="400px"'},
                {text: '300px', value: 'height="300px"'},
                {text: '200px', value: 'height="200px"'},
                {text: '100px', value: 'height="100px"'},
            ]
        },
        {
            type: 'button', 
            name: 'button', 
            label: 'Background Image',
            text: 'Select image',
            icon: 'icon dashicons-format-gallery',
             onclick: function(e) {
               e.preventDefault();
               UXgalleryModal();
            },
        },
        {
            type: 'listbox', 
            name: 'parallax', 
            label: 'Background Parallax', 
            'values': [
                {text: 'Disabled', value:'parallax="0"'},
                {text: 'Low', value: 'parallax="1"'},
                {text: 'Normal', value: 'parallax="3"'},
                {text: 'Stronger', value: 'parallax="6"'},
                {text: 'Strongest', value: 'parallax="9"'},
            ]
        },
        {
            type: 'listbox', 
            name: 'parallax_text', 
            label: 'Text Parallax', 
            'values': [
                {text: 'Disabled', value: 'parallax="0"'},
                {text: 'Low', value: 'parallax="1"'},
                {text: 'Normal', value: 'parallax_="3"'},
                {text: 'Stronger', value: 'parallax="6"'},
                {text: 'Strongest', value: 'parallax="9"'},
            ]
        },
        {
            type: 'listbox', 
            name: 'text_animation', 
            label: 'Text Animation', 
            'values': uxAnimations
        },
        {
            type: 'listbox', 
            name: 'text_color', 
            label: 'Text color', 
            tooltip: 'Select light/dark color on text',
            'values': [
                {text: 'Light text', value: 'text_color="light"', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text: 'Dark text', value: 'text_color="dark"', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                
            ]
        },
        {
            type: 'listbox', 
            name: 'text_layout', 
            label: 'Text Layout', 
            tooltip: 'Select predefined text position',
            'values': [
                {text:'Text Center', value: 'text_align="center" text_pos="center" text_width="70%"', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Text Left', value: 'text_align="left" text_pos="left center" text_width="40%" text_bg=""', style: list_style+' background-image: url("data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAKAAAABkCAYAAAABtjuPAAAKQWlDQ1BJQ0MgUHJvZmlsZQAASA2dlndUU9kWh8+9N73QEiIgJfQaegkg0jtIFQRRiUmAUAKGhCZ2RAVGFBEpVmRUwAFHhyJjRRQLg4Ji1wnyEFDGwVFEReXdjGsJ7601896a/cdZ39nnt9fZZ+9917oAUPyCBMJ0WAGANKFYFO7rwVwSE8vE9wIYEAEOWAHA4WZmBEf4RALU/L09mZmoSMaz9u4ugGS72yy/UCZz1v9/kSI3QyQGAApF1TY8fiYX5QKUU7PFGTL/BMr0lSkyhjEyFqEJoqwi48SvbPan5iu7yZiXJuShGlnOGbw0noy7UN6aJeGjjAShXJgl4GejfAdlvVRJmgDl9yjT0/icTAAwFJlfzOcmoWyJMkUUGe6J8gIACJTEObxyDov5OWieAHimZ+SKBIlJYqYR15hp5ejIZvrxs1P5YjErlMNN4Yh4TM/0tAyOMBeAr2+WRQElWW2ZaJHtrRzt7VnW5mj5v9nfHn5T/T3IevtV8Sbsz55BjJ5Z32zsrC+9FgD2JFqbHbO+lVUAtG0GQOXhrE/vIADyBQC03pzzHoZsXpLE4gwnC4vs7GxzAZ9rLivoN/ufgm/Kv4Y595nL7vtWO6YXP4EjSRUzZUXlpqemS0TMzAwOl89k/fcQ/+PAOWnNycMsnJ/AF/GF6FVR6JQJhIlou4U8gViQLmQKhH/V4X8YNicHGX6daxRodV8AfYU5ULhJB8hvPQBDIwMkbj96An3rWxAxCsi+vGitka9zjzJ6/uf6Hwtcim7hTEEiU+b2DI9kciWiLBmj34RswQISkAd0oAo0gS4wAixgDRyAM3AD3iAAhIBIEAOWAy5IAmlABLJBPtgACkEx2AF2g2pwANSBetAEToI2cAZcBFfADXALDIBHQAqGwUswAd6BaQiC8BAVokGqkBakD5lC1hAbWgh5Q0FQOBQDxUOJkBCSQPnQJqgYKoOqoUNQPfQjdBq6CF2D+qAH0CA0Bv0BfYQRmALTYQ3YALaA2bA7HAhHwsvgRHgVnAcXwNvhSrgWPg63whfhG/AALIVfwpMIQMgIA9FGWAgb8URCkFgkAREha5EipAKpRZqQDqQbuY1IkXHkAwaHoWGYGBbGGeOHWYzhYlZh1mJKMNWYY5hWTBfmNmYQM4H5gqVi1bGmWCesP3YJNhGbjS3EVmCPYFuwl7ED2GHsOxwOx8AZ4hxwfrgYXDJuNa4Etw/XjLuA68MN4SbxeLwq3hTvgg/Bc/BifCG+Cn8cfx7fjx/GvyeQCVoEa4IPIZYgJGwkVBAaCOcI/YQRwjRRgahPdCKGEHnEXGIpsY7YQbxJHCZOkxRJhiQXUiQpmbSBVElqIl0mPSa9IZPJOmRHchhZQF5PriSfIF8lD5I/UJQoJhRPShxFQtlOOUq5QHlAeUOlUg2obtRYqpi6nVpPvUR9Sn0vR5Mzl/OX48mtk6uRa5Xrl3slT5TXl3eXXy6fJ18hf0r+pvy4AlHBQMFTgaOwVqFG4bTCPYVJRZqilWKIYppiiWKD4jXFUSW8koGStxJPqUDpsNIlpSEaQtOledK4tE20Otpl2jAdRzek+9OT6cX0H+i99AllJWVb5SjlHOUa5bPKUgbCMGD4M1IZpYyTjLuMj/M05rnP48/bNq9pXv+8KZX5Km4qfJUilWaVAZWPqkxVb9UU1Z2qbapP1DBqJmphatlq+9Uuq43Pp893ns+dXzT/5PyH6rC6iXq4+mr1w+o96pMamhq+GhkaVRqXNMY1GZpumsma5ZrnNMe0aFoLtQRa5VrntV4wlZnuzFRmJbOLOaGtru2nLdE+pN2rPa1jqLNYZ6NOs84TXZIuWzdBt1y3U3dCT0svWC9fr1HvoT5Rn62fpL9Hv1t/ysDQINpgi0GbwaihiqG/YZ5ho+FjI6qRq9Eqo1qjO8Y4Y7ZxivE+41smsImdSZJJjclNU9jU3lRgus+0zwxr5mgmNKs1u8eisNxZWaxG1qA5wzzIfKN5m/krCz2LWIudFt0WXyztLFMt6ywfWSlZBVhttOqw+sPaxJprXWN9x4Zq42Ozzqbd5rWtqS3fdr/tfTuaXbDdFrtOu8/2DvYi+yb7MQc9h3iHvQ732HR2KLuEfdUR6+jhuM7xjOMHJ3snsdNJp9+dWc4pzg3OowsMF/AX1C0YctFx4bgccpEuZC6MX3hwodRV25XjWuv6zE3Xjed2xG3E3dg92f24+ysPSw+RR4vHlKeT5xrPC16Il69XkVevt5L3Yu9q76c+Oj6JPo0+E752vqt9L/hh/QL9dvrd89fw5/rX+08EOASsCegKpARGBFYHPgsyCRIFdQTDwQHBu4IfL9JfJFzUFgJC/EN2hTwJNQxdFfpzGC4sNKwm7Hm4VXh+eHcELWJFREPEu0iPyNLIR4uNFksWd0bJR8VF1UdNRXtFl0VLl1gsWbPkRoxajCCmPRYfGxV7JHZyqffS3UuH4+ziCuPuLjNclrPs2nK15anLz66QX8FZcSoeGx8d3xD/iRPCqeVMrvRfuXflBNeTu4f7kufGK+eN8V34ZfyRBJeEsoTRRJfEXYljSa5JFUnjAk9BteB1sl/ygeSplJCUoykzqdGpzWmEtPi000IlYYqwK10zPSe9L8M0ozBDuspp1e5VE6JA0ZFMKHNZZruYjv5M9UiMJJslg1kLs2qy3mdHZZ/KUcwR5vTkmuRuyx3J88n7fjVmNXd1Z752/ob8wTXuaw6thdauXNu5Tnddwbrh9b7rj20gbUjZ8MtGy41lG99uit7UUaBRsL5gaLPv5sZCuUJR4b0tzlsObMVsFWzt3WazrWrblyJe0fViy+KK4k8l3JLr31l9V/ndzPaE7b2l9qX7d+B2CHfc3em681iZYlle2dCu4F2t5czyovK3u1fsvlZhW3FgD2mPZI+0MqiyvUqvakfVp+qk6oEaj5rmvep7t+2d2sfb17/fbX/TAY0DxQc+HhQcvH/I91BrrUFtxWHc4azDz+ui6rq/Z39ff0TtSPGRz0eFR6XHwo911TvU1zeoN5Q2wo2SxrHjccdv/eD1Q3sTq+lQM6O5+AQ4ITnx4sf4H++eDDzZeYp9qukn/Z/2ttBailqh1tzWibakNml7THvf6YDTnR3OHS0/m/989Iz2mZqzymdLz5HOFZybOZ93fvJCxoXxi4kXhzpXdD66tOTSna6wrt7LgZevXvG5cqnbvfv8VZerZ645XTt9nX297Yb9jdYeu56WX+x+aem172296XCz/ZbjrY6+BX3n+l37L972un3ljv+dGwOLBvruLr57/17cPel93v3RB6kPXj/Mejj9aP1j7OOiJwpPKp6qP6391fjXZqm99Oyg12DPs4hnj4a4Qy//lfmvT8MFz6nPK0a0RupHrUfPjPmM3Xqx9MXwy4yX0+OFvyn+tveV0auffnf7vWdiycTwa9HrmT9K3qi+OfrW9m3nZOjk03dp76anit6rvj/2gf2h+2P0x5Hp7E/4T5WfjT93fAn88ngmbWbm3/eE8/syOll+AAACsElEQVR4Ae3cMW6iUQxF4cloGlbB/pfFKigzUaq0tm50C39UFO9d28dHf4GAj/f7/fnHC4ESgb+lusoi8E2AgESoEiBgFb/iBORAlQABq/gVJyAHqgQIWMWvOAE5UCVAwCp+xQnIgSoBAlbxK05ADlQJELCKX3ECcqBKgIBV/IoTkANVAgSs4lecgByoEiBgFb/iBORAlQABq/gVJyAHqgQIWMWvOAE5UCVAwCp+xf+lEbxer3RkJO/5fEZyhGQJeAJmeUobEiDgEJjjWQIEzPKUNiRAwCEwx7MECJjlKW1IgIBDYI5nCRAwy1PakMCHf0gdEnM8SsATMIpT2JQAAafEnI8SIGAUp7ApAQJOiTkfJUDAKE5hUwIEnBJzPkrgzNexotR+hPma1w8Yi7eegAtoruQIEDDHUtKCAAEX0FzJESBgjqWkBQECLqC5kiNAwBxLSQsCBFxAcyVHgIA5lpIWBAi4gOZKjgABcywlLQgQcAHNlRwBAuZYSloQIOACmis5AgTMsZS0IOBXcQtoruQIeALmWEpaECDgAporOQIEzLGUtCBAwAU0V3IECJhjKWlBgIALaK7kCMR/Ffd4PHLd/VLS1x8y/VKy2CkBT8ApMeejBAgYxSlsSoCAU2LORwkQMIpT2JQAAafEnI8SIGAUp7ApAQJOiTkfJUDAKE5hUwLxD6J9yDtdwe3znoC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+fnoD1FdxugIC391+f/j/GCRhfLR/HBAAAAABJRU5ErkJggg==");'},
                {text:'Text Left Centered', value: 'text_align="center" text_pos="left center" text_width="40%" text_bg=""', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Text Right', value: 'text_align="right" text_pos="right center" text_width="40%" text_bg=""', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Text Right Centered', value: 'text_align="center" text_pos="right center" text_width="40%" text_bg=""', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Text Bottom Center', value: 'text_align="center" text_pos="bottom center" text_width="40%" text_bg=""', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Text Top Left', value: 'text_align="left" text_pos="left top" text_width="40%" text_bg=""', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Text Top Center', value: 'text_align="center" text_pos="top center" text_width="70%" text_bg=""', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Boxed Text Left', value: 'text_align="left" text_pos="left center" text_width="40%" text_bg="#000" text_bg_opacity=0.8" padding="30px"', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Boxed Text Right', value: 'text_align="left" text_pos="right center" text_width="40%" text_bg="#000" text_bg_opacity=0.8" padding="30px"', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Boxed Text Center', value: 'text_align="center" text_pos="center" text_width="40%" text_bg="#000" text_bg_opacity=0.8" padding="30px"', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text:'Boxed Badge style', value: 'text_align="center" text_pos="bottom full-width" text_bg="#000" text_bg_opacity=0.8" padding="10px"', style: list_style+' background-image: url("data:image/png;base64, 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");'},
            ]
        },
        {
            type: 'listbox', 
            name: 'text_content', 
            label: 'Text Content', 
            tooltip :'Select predefined text, you can change this in the editor',
            'values': [
                {text: 'Default', value: '<h4 class="alt-font">Smaller On Top</h4><p>___</p><h1>BIG HEADLINE</h1><h4 class="thin-font">A smaller text under headline</h4><p>[button text="button" link="#" size="medium" style="is-outline white"]</p>', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text: 'Big banner', value: '<h3 class="alt-font">Smaller On Top</h3><p>____</p><h1 class="h-large">BIG HEADLINE</h1><h4 class="thin-font">A smaller text under headline</h4><p>[button text="button" link="#" size="medium" style="is-outline white"] <br>[button text="button" link="#" size="medium" style="is-outline white"] <br>[button text="button" link="#" size="medium" style="is-outline white"]</p>', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text: 'Simple', value: '<h1>BIG HEADLINE</h1><h4 class="thin-font">A smaller text under headline</h4>', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text: 'Simple two buttons', value: '<h2>BIG HEADLINE</h2><h4 class="thin-font">A smaller text under headline</h4><p>[button text="button" link="#" size="medium" style=""] <br>[button text="button" link="#" size="medium" style="is-outline"]</p>', style: list_style+' background-image: url("data:image/png;base64, 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");'},
                {text: 'Bordered Headline', value: '<h2 class="text-bordered-white">BIG HEADLINE</h2><h4 class="thin-font">A smaller text under headline</h4>', style: list_style+' background-image: url("data:image/png;base64, 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");'},
            ]
        },
        {
            type: 'listbox', 
            name: 'banner_effect', 
            label: 'Effects', 
            'values': [
                {text: 'No effect', value: 'effect=""'},
                {text: 'Snow', value: 'effect="snow"'},
                {text: 'Confetti', value: 'effect="confetti"'},
                {text: 'Sliding Glass', value: 'effect="sliding-glass"'},
                {text: 'Sparkle', value: 'effect="sparkle"'},
                {text: 'Rain', value: 'effect="rain"'},
            ]
        },
    ],
        onsubmit: function(e){
            var banner_content = '[ux_banner '+e.data.parallax+' bg="'+ux_selected_image+'" '+e.data.height+' '+e.data.banner_effect+'][text_box '+e.data.text_color+' '+e.data.text_layout+'  '+e.data.parallax_text+' '+e.data.text_animation+'] '+e.data.text_content+' [/text_box] [/ux_banner]';
            if(e.data.text_color == 'text_color="dark"'){
              var banner_content = banner_content.replace(/white/g, "dark");
              var banner_content = banner_content.replace(/#000/g, "#fff");
            }
            editor.insertContent(banner_content);
        }
    });
}
// END BANNERS
/* ADD SECTION */
function ux_add_section(editor){
    ux_selected_image = 'http://imageurl';
    editor.windowManager.open( {
        title: 'Insert Section',
        body: [
        {
            type: 'textbox', 
            name: 'padding', 
            label: 'Padding',
            value: '30px',
        },
        {
            type: 'button', 
            name: 'button', 
            label: 'Background Image',
            text: 'Select image',
            icon: 'icon dashicons-format-gallery',
             onclick: function(e){
               e.preventDefault();
               UXgalleryModal();
            },
        },
        {
            type: 'listbox', 
            name: 'parallax', 
            label: 'Background Parallax', 
            'values': [
                {text: 'Disabled', value:'parallax="0"'},
                {text: 'Low', value: 'parallax="1"'},
                {text: 'Normal', value: 'parallax="3"'},
                {text: 'Stronger', value: 'parallax="6"'},
                {text: 'Strongest', value: 'parallax="9"'},
            ]
        },
        {
            type: 'listbox', 
            name: 'parallax_text', 
            label: 'Text Parallax', 
            'values': [
                {text: 'Disabled', value: 'parallax_text="0"'},
                {text: 'Low', value: 'parallax_text="1"'},
                {text: 'Normal', value: 'parallax_text="3"'},
                {text: 'Stronger', value: 'parallax_text="6"'},
                {text: 'Strongest', value: 'parallax_text="9"'},
            ]
        },
        {
            type: 'textbox', 
            name: 'margin', 
            label: 'Margin bottom',
            value: '0px',
        },
        {
            type: 'listbox', 
            name: 'text_color', 
            label: 'Text Color', 
            'values': [
                {text: 'Normal', value: ''},
                {text: 'Light (for dark backgrounds)', value: 'dark="true"'},
            ]
        }

    ],
        onsubmit: function(e){
            editor.insertContent( '[section bg="'+ux_selected_image+'" title="" padding="'+e.data.padding+'" '+e.data.text_color+' '+e.data.parallax_text+' '+e.data.parallax+' margin="'+e.data.margin+'"]<br><br>[/section]');
        }
    });
}
// END SECTIIONS
/* ADD ROW */
function ux_add_row(editor){
    editor.windowManager.open({
        title: 'Insert Row',
        body: [
        {
            type: 'listbox', 
            name: 'columns', 
            label: 'Columns', 
            'values': [
                {text: '1/1 (Full width)', value: '1'},
                {text: '1/2 | 1/2', value: '2'},
                {text: '1/3 | 1/3 | 1/3', value:'3'},
                {text: '1/4 | 1/4 | 1/4 | 1/4', value:'4'},
                {text: '1/6 | 1/6 | 1/6 | 1/6 | 1/6 | 1/6', value: '6'},
                {text: '1/3 | 2/3', value:'1-3'},
                {text: '2/4 | 1/4 | 1/4', value:'2-1-1'},
            ]
        },
        {
            type: 'listbox', 
            name: 'column_animate', 
            label: 'Animate Columns?', 
            'values': uxAnimations
              
            
        },
        {
            type: 'listbox', 
            name: 'columns_hover', 
            label: 'Column Hover effect', 
            'values': [
                {text: 'No Effect', value:' '},
                {text: 'Focus', value: 'hover="focus"'},
                {text: 'Fade In', value:'hover="fade"'},
                {text: 'Blur', value: 'hover="blur"'},
                {text: 'Grayscale', value: 'hover="grayscale"'},
            ]
        },
        {
            type: 'listbox', 
            name: 'row_style', 
            label: 'Column Style', 
            'values': [
                {text: 'Default', value:' '},
                {text: 'Collapsed (no padding)', value: 'style="collapse"'},
                {text: 'Divided with lines', value:'style="divided"'},
                {text: 'Boxed style', value:'style="boxed"'},
            ]
        },
         {
            type: 'listbox', 
            name: 'column_content', 
            label: 'Column Content', 
            'values': [
                {text: 'Blank', value:'Insert content here...<br>'},
                {text: 'Text', value:'<h3>Add a title here</h3>[divider]<p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>'},
                {text: 'Featured Box - Icon Top', value:'[featured_box title="Title text" img="http://iconurl" img_width="" pos="center" link=""]<p>Featured box text</p>[/featured_box]<br>'},
                {text: 'Featured Box - Icon Left', value:'[featured_box title="Title text" img="http://iconurl" img_width="" pos="left" link=""]<p>Featured box text</p>[/featured_box]<br>'},
                {text: 'Team Members', value:'[team_member name="Name" title="Title" facebook="http://" twitter="http://" pinterest="http://"  img="http://imageurl"]<br>Team member description<br>[/team_member]<br>'},
                {text: 'Price Table', value:'[ux_price_table title="Awesome title" featured="false" description="This is a description" button_text="Order Now" button_link="#"]<br>[bullet_item text="This is a bullet item"]<br>[bullet_item text="This is a bullet item"]<br>[bullet_item text="This is a bullet item"]<br>[/ux_price_table]<br>'},
                {text: 'Testimonial', value:'[testimonial image="http://imageurl" name="Author name" company="Company name" stars="5"]<br> Add testimonial text here <br>[/testimonial]<br>'},
            ]
        }
    ],
        onsubmit: function(e){
            if(e.data.columns == '1'){
               var insertContent = '[col span="1/1" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>';
            }
             if(e.data.columns == '2'){
               var insertContent = '[col span="1/2" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/2" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>';
            }
            if(e.data.columns == '3'){
               var insertContent = '[col span="1/3" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/3" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/3" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>';
            }
            if(e.data.columns == '4'){
               var insertContent = '[col span="1/4" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/4" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/4" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/4" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>';
            }
            if(e.data.columns == '6'){
               var insertContent = '[col span="1/6" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/6" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/6" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/6" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/6" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/6" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/6" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br> ';
            }
            if(e.data.columns == '1-3'){
               var insertContent = '[col span="1/3" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="2/3" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>';
            }
            if(e.data.columns == '2-1-1'){
               var insertContent = '[col span="2/4" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/4" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>[col span="1/4" '+e.data.columns_hover+' '+e.data.column_animate+']<br>'+e.data.column_content+'<br/>[/col]<br>';
            }
            editor.insertContent('[row '+e.data.row_style+']<p>'+insertContent+'</p>[/row]<br>');
        }
    });
}
// END ROW
var uxAnimations = [
    {text: 'No Animations', value:''},
    {text: 'FadeInLeft', value:'animate="fadeInLeft"'},
    {text: 'FadeInRight', value: 'animate="fadeInRight"'},
    {text: 'Fade In Up', value: 'animate="fadeInUp"'},
    {text: 'Fade In Down', value: 'animate="fadeInDown"'},
    {text: 'Bounce In', value: 'animate="bounceIn"'},
    {text: 'Bounce In Up', value: 'animate="bounceInUp"'},
    {text: 'Bounce In Down', value: 'animate="bounceInDown"'},
    {text: 'Bounce In Left', value: 'animate="bounceInLeft"'},
    {text: 'Bounce In Right', value: 'animate="bounceInRight"'},
    {text: 'Rotate In Left', value: 'animate="rotateInUpLeft"'},
    {text: 'Rotate In Right', value: 'animate="rotateInDownRight"'},
    {text: 'Flip In X', value: 'animate="flipInX"'},
    {text: 'Flip In Y', value: 'animate="flipInY"'},
]
function UXgalleryModal(){
    // Uploading files
var file_frame;
    // If the media frame already exists, reopen it.
    if (file_frame){
      file_frame.open();
      return;
    }
    // Create the media frame.
    file_frame = wp.media.frames.file_frame = wp.media({
      title: jQuery( this ).data( 'uploader_title' ),
      button: {
        text: jQuery( this ).data('uploader_button_text'),
      },
      multiple: false  // Set to true to allow multiple files to be selected
    });

    // When an image is selected, run a callback.
    file_frame.on('select', function(){
      // We set multiple to false so only get one image from the uploader
      attachment = file_frame.state().get('selection').first().toJSON();
      ux_selected_image = attachment.url;
      jQuery('.mce-i-icon.dashicons-format-gallery').parent().addClass('image-bg-button');
      jQuery('.mce-i-icon.dashicons-format-gallery').parent().css('background-image','url('+attachment.url+')');
      // Do something with attachment.id and/or attachment.url here
    });
    // Finally, open the modal
    file_frame.open();
}
})();