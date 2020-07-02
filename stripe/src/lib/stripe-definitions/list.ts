
export interface List<T> {
  /**
   * Value is 'list'
   */
  object: 'list';

  /**
   * An array containing the actual response elements, paginated by any request parameters.
   */
  data: T[];

  /**
   * Whether or not there are more elements available after this set. If false, this set comprises the end of the list.
   */
  has_more: boolean;

  /**
   * The URL for accessing this list.
   */
  url: string;
}