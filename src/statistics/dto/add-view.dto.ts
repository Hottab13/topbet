export class AddViewDto {
  readonly IPv4: string;
  readonly city: string;
  readonly country_code: string;
  readonly country_name: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly postal: string;
  readonly state: string;
}
