/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test_openssl.c ~ 2012/12/25 22:28:55
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
#include <stdio.h>
#include <stdlib.h>

#include <openssl/ssl.h>
#include <openssl/err.h>
#include <openssl/pem.h>

void exportPubkey(RSA *rsa) {
  BIO *bio = BIO_new(BIO_s_mem());
  if (bio == NULL) {
    return;
  }

  // Get Public Key
  if (!PEM_write_bio_RSA_PUBKEY(bio, rsa)) {
    BIO_vfree(bio);
    return;
  }

  char *data;
  long length = BIO_get_mem_data(bio, &data);
  printf("%ld\n", length);
  for(int i = 0; i < length; i ++) {
    printf("%02X", data[i]);
    switch (i & 0xF) {
      case 0x7: printf("  "); break;
      case 0xF: printf("\n"); break;
      default: printf(" ");
    }
  }
  printf("\n");
  BIO_vfree(bio);
}

void exportPrikey(RSA *rsa) {
  BIO *bio = BIO_new(BIO_s_mem());
  if (bio == NULL) {
    return;
  }

  // Get Private Key
  if (!PEM_write_bio_RSAPrivateKey(bio, rsa,
                                   NULL, NULL, 0, NULL, NULL)) {
    BIO_vfree(bio);
    return;
  }

  char *data;
  long length = BIO_get_mem_data(bio, &data);
  printf("%ld\n", length);
  for(int i = 0; i < length; i ++) {
    printf("%02X", data[i]);
    switch (i & 0xF) {
      case 0x7: printf("  "); break;
      case 0xF: printf("\n"); break;
      default: printf(" ");
    }
  }
  printf("\n");
  BIO_vfree(bio);
}

int main(int argc, char **argv) {
  BIGNUM *eBig = BN_new();
  if (eBig == NULL) {
    return EXIT_FAILURE;
  }

  if (!BN_set_word(eBig, 65537)) {
    BN_free(eBig);
    return EXIT_FAILURE;
  }

  RSA *rsa = RSA_new();
  if (rsa == NULL) {
    BN_free(eBig);
    return EXIT_FAILURE;
  }

  if (RSA_generate_key_ex(rsa, 256, eBig, NULL) < 0) {
    RSA_free(rsa);
    BN_free(eBig);
    return EXIT_FAILURE;
  }

  // OK
  exportPubkey(rsa);
  exportPrikey(rsa);

  // Exit
  BN_free(eBig);
  RSA_free(rsa);
  return EXIT_SUCCESS;
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
