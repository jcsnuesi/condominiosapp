export class BtnToggleStyle {
    static btnToggleDeleteActive(status: string) {
        return status === 'inactive'
            ? {
                  severity: 'success',
                  icono: 'pi pi-plus',
                  class: 'p-button-rounded hover:bg-green-600 hover:border-green-600 hover:text-white',
              }
            : {
                  severity: 'danger',
                  icono: 'pi pi-trash',
                  class: 'p-button-rounded hover:bg-red-600 hover:border-red-600 hover:text-white',
              };
    }
}
