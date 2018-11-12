/**
 * External dependencies
 */
import React from 'react';
import { element, i18n, components, editor } from 'wp';

/**
 * Internal dependencies
 */
import './style.scss';


const { Fragment } = element;
const { __ } = i18n;

const { IconButton, Toolbar, PanelBody, TextControl, SelectControl, RangeControl } = components;
const { BlockControls, RichText, MediaPlaceholder, MediaUpload, InspectorControls, PanelColorSettings } = editor;

/**
 * Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image' ];

export const name = 'hero';

export const settings = {
  title: __('Hero (sivil)'),

  // description: __('A custom block for Gutenberg Cloud'),

  icon: 'cover-image',

  attributes: {
    url: {
      type: 'string',
    },
    id: {
      type: 'number',
    },
    text: {
      type: 'string',
      source: 'html',
      selector: 'h1',
    },
    backgroundColor: {
      type: 'string',
      default: '#FFFFFF', // hexa with 6 digits
    },
    backgroundOpacity: {
      type: 'number',
      default: 50,
    },
    contentClassName: {
      type: 'string',
    },
    contentWidth: {
      type: 'number',
      default: 50,
    },
    contentVerticalPosition: {
      type: 'string',
      default: 'bottom',
    },
    contentHorizontalPosition: {
      type: 'string',
      default: 'left',
    },
  },

  edit ({ attributes, className, setAttributes, isSelected }) {
    const {
      url,
      id,
      text,
      backgroundColor,
      backgroundOpacity,
      contentClassName,
      contentWidth,
      contentHorizontalPosition,
      contentVerticalPosition,
    } = attributes;

    const onSelectMedia = media => {
      if (!media || ! media.url) {
        setAttributes({ url: undefined, id: undefined });
        return;
      }

      setAttributes({
        url: media.url,
        id: media.id,
      });
    };

    const controls = (
      <Fragment>
        <BlockControls>
          { !! url && (
            <Fragment>
              <Toolbar>
                <MediaUpload
                  onSelect={ onSelectMedia }
                  allowedTypes={ ALLOWED_MEDIA_TYPES }
                  value={ id }
                  render={ ({ open }) => (
                    <IconButton
                      className="components-toolbar__control"
                      label={ __('Edit media') }
                      icon="edit"
                      onClick={ open }
                    />
                  ) }
                />
              </Toolbar>
            </Fragment>
          ) }
        </BlockControls>

        { !! url && (
          <InspectorControls>
            <PanelBody title={ __('Content Settings') }>
              <SelectControl
                label={ __('Content Width') }
                value={ contentWidth }
                options={ [
                  { label: '1/1', value: 100 },
                  { label: '1/2', value: 50 },
                  { label: '1/3', value: 33 },
                  { label: '1/4', value: 25 },
                ] }
                onChange={ value => setAttributes({ contentWidth: value }) }
              />

              { contentWidth !== '100' && (
                <SelectControl
                  label={ __('Content Horizontal Position') }
                  value={ contentHorizontalPosition }
                  options={ [
                    { label: __('Left'), value: 'left' },
                    { label: __('Center'), value: 'center' },
                    { label: __('Right'), value: 'right',
                    },
                  ] }
                  onChange={ value => setAttributes({ contentHorizontalPosition: value }) }
                />
              ) }

              <SelectControl
                label={ __('Content Vertical Position') }
                value={ contentVerticalPosition }
                options={ [
                  { label: __('Top'), value: 'top' },
                  { label: __('Center'), value: 'center' },
                  { label: __('Bottom'), value: 'bottom' },
                ] }
                onChange={ value => setAttributes({ contentVerticalPosition: value }) }
              />

              <TextControl
                label={ __('Wrapper CSS Class') }
                value={ contentClassName }
                onChange={ value => setAttributes({ contentClassName: value }) }
              />
            </PanelBody>

            <PanelColorSettings
              title={ __('Content Overlay') }
              initialOpen={ true }
              colorSettings={ [ {
                value: backgroundColor,
                onChange: color => setAttributes({ backgroundColor: color }),
                label: __('Overlay Color'),
              } ] }
            >
              <RangeControl
                label={ __('Overlay opacity') }
                value={ backgroundOpacity }
                onChange={ value => setAttributes({ backgroundOpacity: value }) }
                min={ 0 }
                max={ 100 }
                step={ 5 }
              />
            </PanelColorSettings>
          </InspectorControls>
        )}
      </Fragment>
    );

    if (! url) {
      return (
        <Fragment>
          { controls }
          <MediaPlaceholder
            icon="format-image"
            className={ className }
            labels={ {
              title: __('Hero'),
              instructions: __('Drag an image, upload a new one or select a file from your library.'),
            } }
            onSelect={ onSelectMedia }
            accept="image/*"
            allowedTypes={ ALLOWED_MEDIA_TYPES }
          />
        </Fragment>
      );
    }

    const contentClasses = [
      'wp-block-cloudblocks-hero__content',
      contentClassName,
      contentWidth !== '100' && contentHorizontalPosition ? `h-align${contentHorizontalPosition}` : '',
      contentVerticalPosition ? `v-align${contentVerticalPosition}` : '',
    ].join(' ');

    const alpha = Math.round(backgroundOpacity / 100 * 255);
    const hex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();

    const color = backgroundColor ? `${backgroundColor}${hex}` : backgroundColor;

    return (
      <Fragment>
        { controls }

        <div className={ className } style={ url ? { backgroundImage: `url(${url})` } : {} }>
          <div className={ contentClasses }>
            <div className="" style={ { flexBasis: `${contentWidth}%` } }>
              <div className="wp-block-cloudblocks-hero__text" style={ { backgroundColor: color } }>
                { (! RichText.isEmpty(text) || isSelected) && (
                  <RichText
                    tagName="h1"
                    value={ text }
                    placeholder={ __('Write content') }
                    onChange={ value => setAttributes({ text: value }) }
                    inlineToolbar
                  />
                ) }
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  },

  save ({ attributes, className }) {
    const {
      url,
      text,
      backgroundColor,
      backgroundOpacity,
      contentClassName,
      contentWidth,
      contentHorizontalPosition,
      contentVerticalPosition,
    } = attributes;

    const contentClasses = [
      'wp-block-cloudblocks-hero__content',
      contentClassName,
      contentWidth !== '100' && contentHorizontalPosition ? `h-align${contentHorizontalPosition}` : '',
      contentVerticalPosition ? `v-align${contentVerticalPosition}` : '',
    ].join(' ');

    const alpha = Math.round(backgroundOpacity / 100 * 255);
    const hex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();

    const color = backgroundColor ? `${backgroundColor}${hex}` : backgroundColor;

    return (
      <div className={ className } style={ url ? { backgroundImage: `url(${url})` } : {} }>
        <div className={ contentClasses }>
          <div style={ { flexBasis: `${contentWidth}%` } }>
            <div className="wp-block-cloudblocks-hero__text" style={ { backgroundColor: color } }>
              { ! RichText.isEmpty(text) && (
                <RichText.Content tagName="h1" value={ text } />
              ) }
            </div>
          </div>
        </div>
      </div>
    );
  },
};
